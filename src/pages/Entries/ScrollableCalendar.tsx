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

  const startDateStr = new URLSearchParams(useLocation().search).get("date");
  const startDate = startDateStr ? new Date(startDateStr) : new Date();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [topRef, topInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

  // use negative ids for days with no happiness entry
  let counter = useRef(-1);

  // happiness data fetch function
  // where every page represents one week of happiness data
  //  (where days with missing entries are filled of blank entries)
  const fetcher = async (page: number): Promise<HappinessPagination> => {
    const start = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7 * (page + 1),
    );
    const end = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7 * page - (page > 0 ? 1 : 0),
    );
    console.log(start + " " + end);

    const res = await api.get<Happiness[]>("/happiness/", {
      start: formatDate(start),
      end: formatDate(end),
    });

    let itr = new Date(start);
    while (itr <= end) {
      // create empty happiness entry for submitted days
      if (res.data.findIndex((x) => x.timestamp === formatDate(itr)) === -1) {
        res.data.push({
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
    res.data.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // add page attribute so page number is remembered
    return {
      data: res.data,
      page: page,
    };
  };

  // infinite query for fetching happiness
  const {
    isLoading,
    data,
    isError,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery<HappinessPagination>(
    QueryKeys.FETCH_HAPPINESS + " infinite query",
    ({ pageParam = 0 }) => fetcher(pageParam),
    {
      getPreviousPageParam: (firstPage) => {
        // return false if last page
        //
        // *****
        // console.log(firstPage);
        return firstPage.page - 1; // decrement page number to fetch
      },
      getNextPageParam: (lastPage) => {
        // return false if last page
        return lastPage.page + 1; // increment page number to fetch
      },
      refetchOnWindowFocus: false,
    },
  );

  // combine all entries in React Query pages object
  const allEntries = useMemo(
    () =>
      data?.pages?.reduce(
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
    if (topInView) fetchPreviousPage();
  }, [topInView]);

  // autoscroll past top loading message on load
  useEffect(() => {
    // height of loading msg + margin is 100 + 12 = 112
    scrollRef.current!.scrollTop = 112 + 1; // 1 needed to avoid triggering top load
  }, [isLoading]);

  // don't scroll to top when new content prepended
  useEffect(() => {
    if (!isFetchingPreviousPage && scrollRef.current)
      // height of each card + border + margin is 8 + 1 + 140 + 1 = 150
      scrollRef.current.scrollTo({
        top: 112 + 7 * 150,
        behavior: "instant",
      });
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
    <div ref={scrollRef} className="h-full w-[194px] overflow-auto">
      {isLoading ? (
        <Spinner className="m-3" />
      ) : (
        <>
          {isError ? (
            <p className="m-3">Error: Could not load happiness data.</p>
          ) : (
            <div className="px-8">
              <div ref={topRef}>
                <Spinner
                  className="m-3 min-h-[100px]"
                  text="Loading entries..."
                />
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
