import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "react-query";
import BackButton from "../../components/BackButton";
import SmallHappinessCard from "../../components/SmallHappinessCard";
import Spinner from "../../components/Spinner";
import Column from "../../components/layout/Column";
import EntryTextSkeleton from "../../components/skeletons/EntryTextSkeleton";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import {
  createSearchQuery,
  formatDate,
  parseYYYYmmddFormat,
} from "../../utils";
import SearchBar from "../Statistics/SearchBar";
export default function AllSearchResults() {
  const [text, setText] = useState("");
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bottomRef, bottomInView] = useInView();

  const { api } = useApi();

  const { data: numResults, isLoading: isLoadingNum } = useQuery({
    // Find the number of total matching results
    queryKey: [
      QueryKeys.FETCH_HAPPINESS_COUNT,
      { start: formatDate(parseYYYYmmddFormat(startDate)) },
      { end: formatDate(parseYYYYmmddFormat(endDate)) },
      { low: startValue },
      { high: endValue },
      { text: text },
    ],
    queryFn: async () => {
      const query = createSearchQuery(
        text,
        startDate,
        endDate,
        startValue,
        endValue,
      );
      const res = await api.get<Number>("/happiness/search/count", query);
      return res.data;
    },
  });
  const fetchResults = async ({
    pageParam = 0,
  }): Promise<HappinessPagination> => {
    const query = createSearchQuery(
      text,
      startDate,
      endDate,
      startValue,
      endValue,
    );
    query.count = 10;
    query.page = pageParam;
    const res = await api.get<Happiness[]>("/happiness/search", query);
    return {
      data: res.data,
      page: pageParam,
    };
  };
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QueryKeys.FETCH_HAPPINESS,
      QueryKeys.INFINITE,
      { start: formatDate(parseYYYYmmddFormat(startDate)) },
      { end: formatDate(parseYYYYmmddFormat(endDate)) },
      { low: startValue },
      { high: endValue },
      { count: 5 },
      { text: text },
    ],
    queryFn: fetchResults,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  // combine all entries in React Query pages object
  const allEntries = useMemo(
    () =>
      searchResults?.pages.reduce(
        (acc: Happiness[], page) => [...acc, ...page.data],
        [],
      ),
    [searchResults],
  );

  useEffect(() => {
    if (bottomInView) {
      fetchNextPage();
    }
  }, [bottomInView]);

  return (
    <Column className="mx-8 mt-16 gap-6">
      <BackButton relativeUrl="statistics" text="Back to Your Stats" />
      <SearchBar
        text={text}
        setText={setText}
        startValue={startValue}
        setStartValue={setStartValue}
        endValue={endValue}
        setEndValue={setEndValue}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        showResultsPreview={false}
      />
      {isLoadingNum ? (
        <EntryTextSkeleton />
      ) : (
        <p className="text-gray-400">
          <span className={"font-bold text-gray-400"}>
            {numResults?.number}
          </span>{" "}
          entries found
        </p>
      )}
      <Column className="gap-4">
        {allEntries?.map((happiness) => (
          <SmallHappinessCard happiness={happiness} />
        ))}
        {allEntries?.length !== 0 && (
          <div ref={bottomRef}>
            <Spinner className="m-3 min-h-[100px]" text="Loading entries..." />
          </div>
        )}
      </Column>
    </Column>
  );
}
