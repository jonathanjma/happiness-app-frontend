import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Constants, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Journal, JournalPagination } from "../../data/models/Journal";
import {
  dateFromStr,
  formatDate,
  modifyDateDay,
  parseYYYYmmddFormat,
} from "../../utils";
import PrivateEntryPreviewCard from "./PrivateEntryPreviewCard";
import Column from "../../components/layout/Column";

export default function ScrollableJournalCalendar({
  selectedEntry,
  setSelectedEntry,
  setEditing,
}: {
  selectedEntry: Journal | undefined;
  setSelectedEntry: React.Dispatch<React.SetStateAction<Journal | undefined>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { api } = useApi();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date()),
  );

  // start calendar at today if no valid date argument provided, otherwise start at the provided date
  const location = useLocation();
  const startDateStr =
    location.state?.date ??
    new URLSearchParams(useLocation().search).get("date");
  const today = modifyDateDay(new Date(), 0);
  const startDate =
    startDateStr && !isNaN(dateFromStr(startDateStr).getTime())
      ? dateFromStr(startDateStr)
      : today;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  const [topRef, topInView] = useInView();
  const [bottomRef, bottomInView] = useInView();

  // For initializing the selection based on passed in date
  const [madeFirstSelection, setMadeFirstSelection] = useState(false);

  // use negative ids for days with no happiness entry
  let counter = useRef(-1);

  // happiness data fetch function
  // where every page represents one week of happiness data
  //  and days with missing entries are represented with blank entries
  const fetcher = async (page: number): Promise<JournalPagination> => {
    const start = modifyDateDay(
      startDate,
      -7 * (page + 1) + (page >= 0 ? 0 : 1),
    );
    const end = modifyDateDay(startDate, -7 * page - (page > 0 ? 1 : 0));

    const res = await api.get<Journal[]>(
      "/journal/dates/",
      {
        start: formatDate(start),
        end: formatDate(end),
      },
      {
        headers: {
          "Password-Key": sessionStorage.getItem(Constants.PASSWORD_KEY),
        },
      },
    );

    const journalData = res.data;

    // create empty happiness entries for missed days
    const itr = new Date(start);
    while (itr <= end) {
      if (!journalData.find((x) => x.timestamp === formatDate(itr))) {
        journalData.push({
          id: counter.current,
          user_id: user!.id,
          data: "",
          timestamp: formatDate(itr),
        });
        counter.current--;
      }
      itr.setDate(itr.getDate() + 1);
    }

    // reverse sort days
    journalData.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // ensure all dates are before today
    const relevantJournals = journalData.filter(
      (x) => parseYYYYmmddFormat(x.timestamp) <= today,
    );

    // add page attribute so page number is remembered
    return {
      data: relevantJournals,
      page: page,
    };
  };

  // infinite query for fetching journals
  const {
    isLoading,
    data,
    isError,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useInfiniteQuery<JournalPagination>(
    [QueryKeys.FETCH_JOURNAL, QueryKeys.INFINITE, { start: startDate }],
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
    },
  );

  // combine all entries in React Query pages object
  const allEntries = useMemo(
    () =>
      data?.pages.reduce((acc: Journal[], page) => [...acc, ...page.data], []),
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
    // height of loading msg + margin is 85 + 20 = 105
    scrollRef.current!.scrollTop = 105 + 1; // + 1 needed to avoid triggering top load
    setPrevScrollHeight(scrollRef.current!.scrollHeight);
  }, [isLoading]);

  // remain scrolled to same day in calendar when new content prepended
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

  // auto-select the start date as selected entry
  useEffect(() => {
    if (!madeFirstSelection) {
      setSelectedDate(formatDate(startDate));
      setMadeFirstSelection(true);
    }
  }, [startDate]);

  return (
    <div ref={scrollRef} className="scroll-hidden h-full overflow-auto">
      {isLoading ? (
        <Spinner className="m-3" />
      ) : (
        <>
          {isError ? (
            <p className="m-3">Error: Could not load happiness data.</p>
          ) : (
            <div className="mx-8 w-[108px]">
              <div ref={topRef} className="relative m-3 mb-5 min-h-[85px]">
                {hasPreviousPage ? (
                  <Spinner text="Loading entries..." />
                ) : (
                  <p className="absolute bottom-0">No more entries!</p>
                )}
              </div>
              <Column className="gap-3">
                {allEntries &&
                  allEntries.map((entry) => (
                    <PrivateEntryPreviewCard
                      key={entry.id}
                      journal={entry}
                      click={() => {
                        if (entry.timestamp !== selectedDate) {
                          setSelectedDate(entry.timestamp);
                          setEditing(false);
                        }
                      }}
                      selected={entry.timestamp === selectedEntry?.timestamp}
                    />
                  ))}
              </Column>
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
