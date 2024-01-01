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
  const [feedElements, setFeedElements] = useState<React.ReactElement[]>([]);
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

  useEffect(() => {
    if (data === undefined) return;

    const newPageElements = [];
    const numPages = data!.pages.length;
    const lastPage = data!.pages[numPages - 1].data;
    const secondLastPage =
      numPages > 1 ? data.pages[numPages - 2].data : undefined;
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
    setFeedElements([...feedElements, ...newPageElements]);
  }, [data]);

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
