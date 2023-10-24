import * as React from "react";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import HappinessCard from "./HappinessCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import { formatDate } from "../../utils";
import { useUser } from "../../contexts/UserProvider";

// Infinite scrollable calendar for viewing happiness entries
export default function ScrollableCalendar({
  selectedEntry,
  setSelectedEntry,
}: {
  selectedEntry: Happiness | undefined;
  setSelectedEntry: React.Dispatch<React.SetStateAction<Happiness | undefined>>;
}) {
  const { api } = useApi();
  const { user } = useUser();

  // use negative ids for days with no happiness entry
  let counter = useRef(-1);

  // happiness data fetch function
  // where every page represents one week of happiness data
  //  (where days with missing entries are filled of blank entries)
  const fetcher = async (page: number): Promise<HappinessPagination> => {
    const start = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7 * page,
    );
    const end = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7 * (page - 1) - (page > 1 ? 1 : 0),
    );

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
  const { isLoading, data, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<HappinessPagination>(
      ["happiness calendar"],
      ({ pageParam = 1 }) => fetcher(pageParam),
      {
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
      data?.pages.reduce(
        (acc: Happiness[], page) => [...acc, ...page.data],
        [],
      ),
    [data],
  );

  React.useEffect(() => {
    if (allEntries && allEntries.length > 0 && selectedEntry == null) {
      setSelectedEntry(allEntries[0]);
    }
  }, [allEntries]);

  return (
    <div
      className="h-full w-[194px] overflow-auto scroll-hidden"
      id="scrollableDiv"
    >
      {isLoading ? (
        <Spinner className="m-3" />
      ) : (
        <>
          {isError ? (
            <p className="m-3">Error: Could not load happiness data.</p>
          ) : (
            <InfiniteScroll
              dataLength={allEntries ? allEntries.length : 0}
              next={() => fetchNextPage()}
              hasMore={!!hasNextPage}
              loader={<Spinner className="m-3" text="Loading entries..." />}
              scrollableTarget="scrollableDiv"
              className="px-8"
            >
              {allEntries!.map((entry) => (
                <HappinessCard
                  key={entry.id}
                  data={entry}
                  selected={selectedEntry?.id === entry.id}
                  click={() => setSelectedEntry(entry)}
                />
              ))}
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
}
