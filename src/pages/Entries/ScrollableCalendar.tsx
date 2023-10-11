import * as React from "react";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import HappinessCard from "./HappinessCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import { Happiness } from "../../data/models/Happiness";
import { formatDate } from "../../utils";

// type of the paginated happiness data structure used for infinite scroll
interface HappinessPagination {
  data: Happiness[];
  page: number;
}

export default function ScrollableCalendar() {
  const { api } = useApi();

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

    console.log("Data from " + formatDate(start) + " fetched");

    let itr = new Date(start);
    while (itr <= end) {
      // create empty happiness entry for submitted days
      if (res.data.findIndex((x) => x.timestamp === formatDate(itr)) === -1) {
        res.data.push({
          id: counter.current,
          user_id: -1,
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
      },
    );

  // combine all entries in React Query pages object
  const allEntries = useMemo(
    () =>
      data?.pages.reduce((acc: Happiness[], page) => {
        return [...acc, ...page.data];
      }, []),
    [data],
  );

  // used when InfiniteScroll component is loading
  const loadingSpinner = (
    <div className="m-3">
      <Spinner />
      <p className="mt-2">Loading entries...</p>
    </div>
  );

  return (
    <div className="h-full w-[130px] overflow-auto ms-2">
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
              loader={loadingSpinner}
            >
              {allEntries!.map((entry) => (
                <HappinessCard
                  key={entry.id}
                  data={entry}
                  selected={false}
                  click={() => console.log(entry.id)}
                />
              ))}
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
}
