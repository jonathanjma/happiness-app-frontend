import { useApi } from "../../contexts/ApiProvider";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../constants";
import Spinner from "../../components/Spinner";
import Column from "../../components/layout/Column";
import SmallHappinessCard from "../../components/SmallHappinessCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider";

export default function TimelinePanel({
  userId,
  setEntry,
}: {
  userId: number;
  setEntry: React.Dispatch<React.SetStateAction<Happiness | undefined>>;
}) {
  const { api } = useApi();
  const { user } = useUser();
  const navigate = useNavigate();
  const [bottomRef, bottomInView] = useInView();

  // infinite query for fetching happiness
  const { isLoading, data, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<HappinessPagination>({
      queryKey: [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
      queryFn: ({ pageParam = 1 }) =>
        api
          .get<Happiness[]>("/happiness/count", {
            id: userId,
            page: pageParam,
          })
          .then((res): HappinessPagination => {
            return {
              data: res.data,
              page: pageParam,
            };
          }),
      getNextPageParam: (lastPage: HappinessPagination) => {
        // no more pages left if the last page is empty
        if (lastPage.data.length === 0) return false;
        return lastPage.page + 1; // increment page number to fetch
      },
    });

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
    if (bottomInView && hasNextPage) fetchNextPage();
  }, [bottomInView]);

  return (
    <div className="scroll-hidden h-full overflow-auto py-4">
      {isLoading ? (
        <Spinner className="ml-8" />
      ) : (
        <>
          {isError ? (
            <p className="text-gray-400">Error: Could not load entries.</p>
          ) : (
            <div className="mx-8">
              <Column className="gap-3">
                {allEntries &&
                  allEntries.map((entry) => (
                    <SmallHappinessCard
                      key={entry.id}
                      happiness={entry}
                      actions={
                        userId === user!.id
                          ? [
                              {
                                label: "Open In Entries",
                                onClick: () => {
                                  navigate(`/home?date=${entry.timestamp}`);
                                },
                              },
                            ]
                          : [
                              {
                                label: "Expand",
                                modalId: "happiness-viewer",
                                onClick: () => {
                                  setEntry(entry);
                                },
                              },
                            ]
                      }
                    />
                  ))}
              </Column>
              <div ref={bottomRef} className="m-4">
                {hasNextPage ? (
                  <Spinner text="Loading entries..." />
                ) : (
                  <p>No more entries!</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
