import { Group } from "../../data/models/Group";
import Spinner from "../../components/Spinner";
import { useApi } from "../../contexts/ApiProvider";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import FeedCard from "./FeedCard";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { dateFromStr, formatDate, modifyDateDay } from "../../utils";

export const dateOrTodayYesterday = (date: string, otherwise: string) => {
  if (date === formatDate(new Date())) return "Today";
  else if (date === formatDate(modifyDateDay(new Date(), -1)))
    return "Yesterday";
  else return otherwise;
};

export default function GroupFeed({ groupData }: { groupData: Group }) {
  const { api } = useApi();
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();
  const [unreadElements, setUnreadElements] = useState<React.ReactElement[]>(
    [],
  );
  const [feedElements, setFeedElements] = useState<React.ReactElement[]>([]);

  const [unreadRef, unreadInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

  const getNextPageParam = (lastPage: HappinessPagination) => {
    // no more pages left if the last page is empty
    if (lastPage.data.length === 0) return false;
    return lastPage.page + 1; // increment page number to fetch
  };

  const fetcher = async (page: number, unreadReq: boolean) => {
    const res = await api.get<Happiness[]>(
      `/group/${groupData.id}/happiness/${unreadReq ? "unread" : "count"}`,
      {
        page: page,
      },
    );

    if (!unreadReq) {
      res.data.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    }

    const newPageElements = [];
    const pageData = unreadReq ? unreadData : feedData;
    const lastPage = pageData
      ? pageData.pages[pageData.pages.length - 1].data
      : undefined;
    // get last entry on last page
    let prevDate = lastPage ? lastPage[lastPage.length - 1].timestamp : "";

    // add entries from last page to feed and add date seperator between entry cards with different dates
    for (let entry of res.data) {
      if (prevDate !== entry.timestamp) {
        newPageElements.push(
          <h5 key={entry.timestamp} className="mb-4 text-gray-400">
            {dateOrTodayYesterday(
              entry.timestamp,
              dateFromStr(entry.timestamp).toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              }),
            )}
          </h5>,
        );
      }
      newPageElements.push(
        <FeedCard
          key={entry.id}
          data={entry}
          isNew={unreadReq}
          onClick={() => setSelectedEntry(entry)}
        />,
      );
      prevDate = entry.timestamp;
    }

    // update feed
    if (unreadReq) setUnreadElements([...unreadElements, ...newPageElements]);
    else setFeedElements([...feedElements, ...newPageElements]);

    return {
      data: res.data,
      page: page,
    };
  };

  // infinite query for fetching unread entries
  const {
    isLoading: unreadIsLoading,
    data: unreadData,
    isError: unreadIsError,
    fetchNextPage: unreadFetchNextPage,
    hasNextPage: unreadHasNextPage,
  } = useInfiniteQuery<HappinessPagination>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS_UNREAD, groupData.id],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam, true),
    getNextPageParam: getNextPageParam,
  });

  // infinite query for fetching entries
  const {
    isLoading: feedIsLoading,
    data: feedData,
    isError: feedIsError,
    fetchNextPage: feedFetchNextPage,
    hasNextPage: feedHasNextPage,
  } = useInfiniteQuery<HappinessPagination>({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, groupData.id],
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam, false),
    getNextPageParam: getNextPageParam,
    // loads first page of regular feed on initial load
    // (add unreadHasNextPage !== undefined condition to disable this)
    enabled: !unreadHasNextPage,
  });

  // load more entries when bottom reached
  useEffect(() => {
    if (unreadInView && unreadHasNextPage) unreadFetchNextPage();
  }, [unreadInView]);

  useEffect(() => {
    if (bottomInView && feedHasNextPage) feedFetchNextPage();
  }, [bottomInView]);

  return (
    <div className="mx-8">
      {/* Unread feed */}
      {unreadElements.length > 0 && <h5 className="mb-4">Unread</h5>}
      {unreadIsLoading ? (
        <Spinner />
      ) : (
        <>
          {unreadIsError ? (
            <h5 className="text-gray-400">Error: Could not load entries.</h5>
          ) : (
            <div>
              <>{unreadElements}</>
              <div ref={unreadRef} className="m-3">
                {unreadHasNextPage && <Spinner text="Loading entries..." />}
              </div>
            </div>
          )}
        </>
      )}
      {/* Don't show regular feed until unread feed has been consumed */}
      {unreadHasNextPage !== undefined && !unreadHasNextPage && (
        <>
          <h5 className="my-4">Feed</h5>
          {feedIsLoading ? (
            <Spinner />
          ) : (
            <>
              {feedIsError ? (
                <h5 className="text-gray-400">
                  Error: Could not load entries.
                </h5>
              ) : (
                <div>
                  <>{feedElements}</>
                  <div ref={bottomRef} className="m-3">
                    {feedHasNextPage ? (
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
