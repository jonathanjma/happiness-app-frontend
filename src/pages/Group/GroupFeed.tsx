import { Group } from "../../data/models/Group";
import Spinner from "../../components/Spinner";
import { useApi } from "../../contexts/ApiProvider";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import FeedCard from "./FeedCard";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function GroupFeed({ groupData }: { groupData: Group }) {
  const { api } = useApi();
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();

  const [bottomRef, bottomInView] = useInView();

  const fetcher = async (page: number): Promise<HappinessPagination> => {
    const res = await api.get<Happiness[]>(
      "/group/" + groupData.id + "/happiness/count",
      { page: page },
    );

    res.data.sort(
      // reverse sort days
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return {
      data: res.data,
      page: page,
    };
  };

  // infinite query for fetching entries
  const { isLoading, data, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<HappinessPagination>(
      QueryKeys.FETCH_GROUP_HAPPINESS + " infinite query",
      ({ pageParam = 1 }) => fetcher(pageParam),
      {
        getNextPageParam: (lastPage) => {
          // no more pages left if the last page is empty
          if (lastPage.data.length === 0) return false;
          return lastPage.page + 1; // increment page number to fetch
        },
        refetchOnWindowFocus: false,
      },
    );

  // combine all entries in React Query pages object
  const allEntries = useMemo(
    () =>
      data?.pages.reduce(
        (acc: Happiness[], page) => [...acc, ...page.data],
        [],
      ),
    [data],
  );

  // load more entries when bottom reached
  useEffect(() => {
    if (bottomInView) fetchNextPage();
  }, [bottomInView]);

  return (
    <div className="mx-8">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isError ? (
            <h5 className="text-gray-400">Error: Could not load entries.</h5>
          ) : (
            <div>
              {allEntries!.length === 0 ? (
                <h5 className="text-gray-400">No entries yet!</h5>
              ) : (
                <>
                  {allEntries!.map((entry) => (
                    <FeedCard
                      key={entry.id}
                      data={entry}
                      isNew={true}
                      onClick={() => setSelectedEntry(entry)}
                    />
                  ))}
                </>
              )}
              <div ref={bottomRef} className="m-3">
                {hasNextPage ? (
                  <Spinner text="Loading entries..." />
                ) : (
                  <p className="">No more entries!</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {selectedEntry && (
        <HappinessViewerModal happiness={selectedEntry} id="happiness-viewer" />
      )}
    </div>
  );
}
