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
  const [unreadRef, unreadInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

  // used by React query to keep track of next page to fetch
  const getNextPageParam = (lastPage: HappinessPagination) => {
    // no more pages left if the last page is empty
    if (lastPage.data.length === 0) return false;
    return lastPage.page + 1; // increment page number to fetch
  };

  const fetcher = (page: number, unreadReq: boolean) =>
    api
      .get<Happiness[]>(
        `/group/${groupData.id}/happiness/${unreadReq ? "unread" : "count"}`,
        {
          page: page,
        },
      )
      .then((res): HappinessPagination => {
        return {
          data: res.data,
          page: page,
        };
      });

  // infinite query for fetching unread entries
  const unreadQuery = useInfiniteQuery<HappinessPagination>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS_UNREAD, groupData.id],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam, true),
    getNextPageParam: getNextPageParam,
  });

  // infinite query for fetching regular entries
  const feedQuery = useInfiniteQuery<HappinessPagination>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, groupData.id],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam, false),
    getNextPageParam: getNextPageParam,
  });

  // flatten React query pagination object into single list
  const allUnreadEntries = useMemo(
    () =>
      unreadQuery.data?.pages.reduce(
        (acc: Happiness[], page) => [...acc, ...page.data],
        [],
      ),
    [unreadQuery.data],
  );

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
          allUnreadEntries!.findIndex((elt) => elt.id == entry.id) !== -1
        }
        onClick={() => setSelectedEntry(entry)}
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
    if (unreadInView && unreadQuery.hasNextPage) unreadQuery.fetchNextPage();
  }, [unreadInView]);

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
            <div>
              {allUnreadEntries!.length > 0 && <h5 className="mb-4">Unread</h5>}
              {allUnreadEntries!.map((entry, i) =>
                entryToJsx(
                  entry,
                  i > 0 ? allUnreadEntries![i - 1] : undefined,
                  true,
                ),
              )}
              <div ref={unreadRef} className="m-3">
                {unreadQuery.hasNextPage && (
                  <Spinner text="Loading entries..." />
                )}
              </div>
            </div>
          )}
        </>
      )}
      {/* Don't show regular feed until unread feed has been consumed */}
      {unreadQuery.hasNextPage !== undefined && !unreadQuery.hasNextPage && (
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
