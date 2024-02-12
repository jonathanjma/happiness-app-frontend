import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import SmallHappinessCard from "../../components/SmallHappinessCard";
import Spinner from "../../components/Spinner";
import Column from "../../components/layout/Column";
import EntryTextSkeleton from "../../components/skeletons/EntryTextSkeleton";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, HappinessPagination } from "../../data/models/Happiness";
import { createSearchQuery, dateFromStr, formatDate } from "../../utils";
import SearchBar from "../Statistics/SearchBar";
export default function AllSearchResults() {
  const location = useLocation();
  const [text, setText] = useState<string>(location?.state?.text ?? "");
  const [startValue, setStartValue] = useState(
    location?.state?.startValue ?? 0,
  );
  const [endValue, setEndValue] = useState(location?.state?.endValue ?? 10);
  const [startDate, setStartDate] = useState(location?.state?.startDate ?? "");
  const [endDate, setEndDate] = useState(location?.state?.endDate ?? "");
  const [bottomRef, bottomInView] = useInView();

  const { api } = useApi();
  const navigate = useNavigate();

  const { data: numResults, isLoading: isLoadingNum } = useQuery({
    // Find the number of total matching results
    queryKey: [
      QueryKeys.FETCH_HAPPINESS_COUNT,
      { start: formatDate(dateFromStr(startDate)) },
      { end: formatDate(dateFromStr(endDate)) },
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
    pageParam = 1,
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
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QueryKeys.FETCH_HAPPINESS,
      QueryKeys.INFINITE,
      { start: formatDate(dateFromStr(startDate)) },
      { end: formatDate(dateFromStr(endDate)) },
      { low: startValue },
      { high: endValue },
      { count: 5 },
      { text: text },
    ],
    queryFn: fetchResults,
    getNextPageParam: (lastPage) =>
      lastPage.data.length === 10 ? lastPage.page + 1 : undefined,
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
      <BackButton
        state={{
          startDate: startDate,
          endDate: endDate,
          startValue: startValue,
          endValue: endValue,
          text: text,
        }}
        relativeUrl="/statistics"
        text="Back to Your Stats"
      />
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
          <SmallHappinessCard
            happiness={happiness}
            actions={[
              {
                label: "Open In Entries",
                onClick: () => {
                  navigate(`/home?date=${happiness.timestamp}`);
                },
              },
            ]}
          />
        ))}
        {(hasNextPage || isSearchLoading) && allEntries?.length !== 0 && (
          <div ref={bottomRef}>
            <Spinner className="m-3 min-h-[100px]" text="Loading entries..." />
          </div>
        )}
      </Column>
    </Column>
  );
}
