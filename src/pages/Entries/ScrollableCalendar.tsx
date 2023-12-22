import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import HappinessCard from "./HappinessCard";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import { formatDate } from "../../utils";
import { useUser } from "../../contexts/UserProvider";
import { QueryKeys } from "../../constants";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";

// Strips time from Date and shifts the day by the given amount
const modifyDateDay = (date: Date, dayDiff: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayDiff);

// Convert YYYY-MM-DD date string to Date and strip time
const dateFromStr = (dateStr: string) => new Date(dateStr + "T00:00:00");

// Infinite scrollable calendar for viewing happiness entries
export default function ScrollableCalendar({
  selectedEntry,
  setSelectedEntry,
  setEditing,
}: {
  selectedEntry: Happiness | undefined;
  setSelectedEntry: React.Dispatch<React.SetStateAction<Happiness | undefined>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { api } = useApi();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date()),
  );

  // start calendar at today if no valid date argument provided, otherwise start at the provided date
  const startDateStr = new URLSearchParams(useLocation().search).get("date");
  const today = modifyDateDay(new Date(), 0);
  const startDate =
    startDateStr && !isNaN(dateFromStr(startDateStr).getTime())
      ? dateFromStr(startDateStr)
      : today;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  const [topRef, topInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

  // use negative ids for days with no happiness entry
  let counter = useRef(-1);

  // happiness data fetch function
  // where every page represents one week of happiness data
  //  and days with missing entries are represented with blank entries
  const fetcher = async (page: number): Promise<HappinessPagination> => {
    const start = modifyDateDay(
      startDate,
      -7 * (page + 1) + (page >= 0 ? 0 : 1),
    );
    const end = modifyDateDay(startDate, -7 * page - (page > 0 ? 1 : 0));

    const res = await api.get<Happiness[]>("/happiness/", {
      start: formatDate(start),
      end: formatDate(end),
    });

    let happinessData = res.data;

    // create empty happiness entries for missed days
    let itr = new Date(start);
    while (itr <= end) {
      if (
        happinessData.findIndex((x) => x.timestamp === formatDate(itr)) === -1
      ) {
        happinessData.push({
          id: counter.current,
          author: user!,
          value: -1,
          comment: "",
          timestamp: formatDate(itr),
        });
        counter.current--;
      }
      itr.setDate(itr.getDate() + 1);
    }

    // reverse sort days
    happinessData.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // ensure all dates are before today
    happinessData = happinessData.filter(
      (x) => dateFromStr(x.timestamp) <= today,
    );

    // add page attribute so page number is remembered
    return {
      data: happinessData,
      page: page,
    };
  };

  // infinite query for fetching happiness
  const {
    isLoading,
    data,
    isError,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useInfiniteQuery<HappinessPagination>(
    QueryKeys.FETCH_HAPPINESS + " infinite query",
    ({ pageParam = 0 }) => fetcher(pageParam),
    {
      getPreviousPageParam: (firstPage) => {
        // no more pages left if the first page is the most recent page
        if (dateFromStr(firstPage.data[0].timestamp) >= today) return false;

        return firstPage.page - 1; // decrement page number to fetch
      },
      getNextPageParam: (lastPage) => {
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

  // load more entries when top reached
  useEffect(() => {
    if (topInView && hasPreviousPage) fetchPreviousPage();
  }, [topInView]);

  // autoscroll past top loading message on load
  useEffect(() => {
    // height of loading msg + margin is 100 + 12 = 112
    scrollRef.current!.scrollTop = 112 + 1; // + 1 needed to avoid triggering top load
    setPrevScrollHeight(scrollRef.current!.scrollHeight);
  }, [isLoading]);

  // remain scrolled to same day in calendar new content prepended
  useEffect(() => {
    // remember div scroll height before previous page fetch
    if (isFetchingPreviousPage) {
      setPrevScrollHeight(scrollRef.current!.scrollHeight);
    }
    // new scroll height is simply: current - previous
    if (!isFetchingPreviousPage && data) {
      scrollRef.current!.scrollTo({
        top: scrollRef.current!.scrollHeight - prevScrollHeight,
        behavior: "instant",
      });
    }
  }, [isFetchingPreviousPage]);

  // display details of selected entry
  useEffect(() => {
    if (allEntries) {
      for (const entry of allEntries) {
        if (entry.timestamp === selectedDate) {
          setSelectedEntry(entry);
          return;
        }
      }
    }
  }, [selectedDate, allEntries]);

  return (
    <div
      ref={scrollRef}
      className="scroll-hidden h-full w-[194px] overflow-auto"
    >
      {isLoading ? (
        <Spinner className="m-3" />
      ) : (
        <>
          {isError ? (
            <p className="m-3">Error: Could not load happiness data.</p>
          ) : (
            <div className="px-8">
              <div ref={topRef} className="relative m-3 min-h-[100px]">
                {hasPreviousPage ? (
                  <Spinner text="Loading entries..." />
                ) : (
                  <p className="absolute bottom-0">No more entries!</p>
                )}
              </div>
              {allEntries!.map((entry) =>
                selectedEntry && entry.id === selectedEntry.id ? (
                  <HappinessCard
                    key={selectedEntry?.id}
                    data={selectedEntry}
                    click={() => {}}
                    selected={true}
                  />
                ) : (
                  <HappinessCard
                    key={entry.id}
                    data={entry}
                    selected={entry.id === selectedEntry?.id}
                    click={() => {
                      if (entry.timestamp !== selectedDate) {
                        setSelectedDate(entry.timestamp);
                        setEditing(false);
                      }
                    }}
                  />
                ),
              )}
              <div ref={bottomRef}>
                <Spinner
                  className="m-3 min-h-[100px]"
                  text="Loading entries..."
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
