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
  const [unreadFeedElements, setUnreadFeedElements] = useState<
    React.ReactElement[]
  >([]);
  const [feedElements, setFeedElements] = useState<React.ReactElement[]>([]);

  const [unreadRef, unreadInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

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
          data: unreadReq
            ? res.data
            : res.data.sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              ),
          page: page,
        };
      });

  // infinite query for fetching unread entries
  // const {
  //   isLoading: unreadIsLoading,
  //   data: unreadData,
  //   isError: unreadIsError,
  //   fetchNextPage: unreadFetchNextPage,
  //   hasNextPage: unreadHasNextPage,
  // } = useInfiniteQuery<HappinessPagination>({
  //   queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS_UNREAD, groupData.id],
  //   queryFn: ({ pageParam = 1 }) => fetcher(pageParam, true),
  //   getNextPageParam: getNextPageParam,
  //   refetchOnWindowFocus: false,
  // });

  // infinite query for fetching entries
  const { isLoading, data, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<HappinessPagination>({
      queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, groupData.id],
      queryFn: ({ pageParam = 1 }) => fetcher(pageParam, false),
      getNextPageParam: getNextPageParam,
      refetchOnWindowFocus: false,
      // enabled: !unreadHasNextPage,
    });

  const onQueryUpdate = (unreadReq: boolean) => {
    const pageData = data; //unreadReq ? unreadData : data;
    if (pageData === undefined) return;

    const newPageElements = [];
    const numPages = pageData!.pages.length;
    const lastPage = pageData!.pages[numPages - 1].data;
    const secondLastPage =
      numPages > 1 ? pageData.pages[numPages - 2].data : undefined;
    // get last entry on second to last page
    let prevDate = secondLastPage
      ? secondLastPage[secondLastPage.length - 1].timestamp
      : "";

    for (let entry of lastPage) {
      // add date seperator between entry cards with different dates
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
      // add entries on last page to feed
      newPageElements.push(
        <FeedCard
          key={entry.id}
          data={entry}
          isNew={false}
          onClick={() => setSelectedEntry(entry)}
        />,
      );
      prevDate = entry.timestamp;
    }

    if (unreadReq)
      setUnreadFeedElements([...unreadFeedElements, ...newPageElements]);
    else setFeedElements([...feedElements, ...newPageElements]);
  };

  // when infinite query data is updated
  useEffect(() => {
    onQueryUpdate(false);
  }, [data]);

  // load more entries when bottom reached
  // useEffect(() => {
  //   if (unreadInView) unreadFetchNextPage();
  // }, [unreadInView]);

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
              {feedElements.length === 0 ? (
                <h5 className="text-gray-400">No entries yet!</h5>
              ) : (
                <>{feedElements}</>
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
