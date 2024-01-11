import { Group } from "../../data/models/Group";
import Spinner from "../../components/Spinner";
import { useApi } from "../../contexts/ApiProvider";
import { useInfiniteQuery, useQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import FeedCard from "./FeedCard";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { dateFromStr, formatDate, modifyDateDay } from "../../utils";

// Returns "today" or "yesterday" if the given date is today or yesterday
// Otherwise returns the default string
export const dateOrTodayYesterday = (date: string, otherwise: string) => {
  if (date === formatDate(new Date())) return "Today";
  else if (date === formatDate(modifyDateDay(new Date(), -1)))
    return "Yesterday";
  else return otherwise;
};

export default function GroupFeed({ groupData }: { groupData: Group }) {
  const { api } = useApi();
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();

  // for infinite scroll
  const [bottomRef, bottomInView] = useInView();

  // query for fetching unread entries
  const unreadQuery = useQuery<Happiness[]>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS_UNREAD, groupData.id],
    queryFn: () =>
      api
        .get<Happiness[]>(`/group/${groupData.id}/happiness/unread`)
        .then((res) => res.data),
  });

  // infinite query for fetching regular entries
  const feedQuery = useInfiniteQuery<HappinessPagination>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, groupData.id],
    queryFn: ({ pageParam = 1 }) =>
      api
        .get<Happiness[]>(`/group/${groupData.id}/happiness/count`, {
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

  // flatten React query pagination object into single list
  const allFeedEntries = useMemo(
    () =>
      feedQuery.data?.pages.reduce(
        (acc: Happiness[], page) => [...acc, ...page.data],
        [],
      ),
    [feedQuery.data],
  );

  const entryToJsx = (
    entry: Happiness,
    prevEntry: Happiness | undefined,
    unreadReq: boolean,
  ) => {
    const feedCard = (
      <FeedCard
        key={entry.id * (unreadReq ? -1 : 1)}
        data={entry}
        isNew={
          unreadReq ||
          unreadQuery.data!.findIndex((elt) => elt.id == entry.id) !== -1
        }
        onClick={() => setSelectedEntry(entry)}
        trackRead={unreadReq}
      />
    );

    // add date boundary if the previous entry has a different timestamp
    if (prevEntry === undefined || entry.timestamp !== prevEntry.timestamp) {
      return (
        <div key={entry.timestamp + " " + unreadReq}>
          <h5 className="mb-4 text-gray-400">
            {dateOrTodayYesterday(
              entry.timestamp,
              dateFromStr(entry.timestamp).toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              }),
            )}
          </h5>
          {feedCard}
        </div>
      );
    }
    return feedCard;
  };

  // load more entries when bottom of infinite scroll reached
  useEffect(() => {
    if (bottomInView && feedQuery.hasNextPage) feedQuery.fetchNextPage();
  }, [bottomInView]);

  return (
    <div className="mx-8">
      {/* Unread feed */}
      {unreadQuery.isLoading ? (
        <Spinner />
      ) : (
        <>
          {unreadQuery.isError ? (
            <h5 className="text-gray-400">Error: Could not load entries.</h5>
          ) : (
            <>
              {unreadQuery.data!.length > 0 && <h5 className="mb-4">Unread</h5>}
              {unreadQuery.data!.map((entry, i) =>
                entryToJsx(
                  entry,
                  i > 0 ? unreadQuery.data![i - 1] : undefined,
                  true,
                ),
              )}
            </>
          )}
        </>
      )}
      {/* Don't show regular feed until unread feed has been consumed */}
      {!unreadQuery.isLoading && (
        <>
          {feedQuery.isLoading ? (
            <Spinner />
          ) : (
            <>
              {feedQuery.isError ? (
                <h5 className="text-gray-400">
                  Error: Could not load entries.
                </h5>
              ) : (
                <div>
                  <h5 className="my-4">Feed</h5>
                  <>
                    {allFeedEntries!.map((entry, i) =>
                      entryToJsx(
                        entry,
                        i > 0 ? allFeedEntries![i - 1] : undefined,
                        false,
                      ),
                    )}
                  </>
                  <div ref={bottomRef} className="m-3">
                    {feedQuery.hasNextPage ? (
                      <Spinner text="Loading entries..." />
                    ) : (
                      <p className="">No more entries!</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {selectedEntry && (
        <HappinessViewerModal happiness={selectedEntry} id="happiness-viewer" />
      )}
    </div>
  );
}
