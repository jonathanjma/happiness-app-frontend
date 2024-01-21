import { useEffect, useState } from "react";
import { useQueries } from "react-query";
import { useNavigate } from "react-router-dom";
import IconClose from "../../assets/IconClose";
import IconFilter from "../../assets/IconFilter";
import Button from "../../components/Button";
import Card from "../../components/Card";
import HappinessNumber from "../../components/HappinessNumber";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness } from "../../data/models/Happiness";
import {
  createSearchQuery,
  formatDate,
  parseYYYYmmddFormat,
} from "../../utils";
import SearchResult from "./SearchResult";

export default function SearchBar({
  text,
  setText,
  startValue,
  setStartValue,
  endValue,
  setEndValue,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showResultsPreview = true,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  startValue: number;
  setStartValue: React.Dispatch<React.SetStateAction<number>>;
  endValue: number;
  setEndValue: React.Dispatch<React.SetStateAction<number>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  showResultsPreview?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [filterShowing, setFilterShowing] = useState(false);
  const [resultsShowing, setResultsShowing] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(-1);

  const navigate = useNavigate();

  // handle showing and hiding filter and results
  const handleToggleFilter = () => {
    if (!filterShowing || resultsShowing) {
      setResultsShowing(false);
      setFilterShowing(true);
    } else {
      setFilterShowing(false);
    }
  };
  const handleShowResults = () => {
    setFilterShowing(false);
    setResultsShowing(true);
  };

  const { api } = useApi();

  const [{ data }, { data: count }] = useQueries([
    {
      // Query first 5 search results
      queryKey: [
        QueryKeys.FETCH_HAPPINESS,
        { start: formatDate(parseYYYYmmddFormat(startDate)) },
        { end: formatDate(parseYYYYmmddFormat(endDate)) },
        { low: startValue },
        { high: endValue },
        { count: 5 },
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
        query.count = 5;
        const res = await api.get<Happiness[]>("/happiness/search", query);
        return res.data;
      },
      enabled: showResultsPreview,
    },
    {
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
    },
  ]);

  // Add keyboard listener for pressing enter and navigation between entries
  useEffect(() => {
    // handle when user presses enter to make a search or change selected entry
    // Initialization of this function must be done in use effect to prevent
    // data from being capturerd in closure
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (
          resultsShowing &&
          selectedEntryIndex >= 0 &&
          data &&
          selectedEntryIndex < data.length
        ) {
          navigate(`/home?date=${data[selectedEntryIndex].timestamp}`);
        } else {
          handleShowResults();
        }
      }
      if (event.key === "ArrowUp" && data && data.length > 0) {
        setSelectedEntryIndex((i) => (i - 1 < 0 ? data.length - 1 : i - 1));
      }
      if (event.key === "ArrowDown" && data && data.length > 0) {
        setSelectedEntryIndex((i) => {
          return i + 1 >= data.length ? 0 : i + 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedEntryIndex]);

  return (
    <Column className="relative z-50 w-full gap-4">
      {/* Search bar */}
      <Row
        className={`items-center rounded-[50px] border-1 border-gray-300 px-6 py-3 hover:border-gray-400 ${
          isFocused
            ? "border-yellow shadow-form-selected hover:border-yellow"
            : ""
        }`}
      >
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Search for keywords"
          className="w-auto flex-grow focus:outline-none"
          onBlur={() => {
            setIsFocused(false);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
        />
        <Row className="gap-4">
          <IconFilter
            color="#808080"
            className="hover:cursor-pointer"
            onClick={handleToggleFilter}
          />
          {text.length !== 0 && (
            <IconClose
              color="#808080"
              className="hover:cursor-pointer"
              onClick={() => {
                setText("");
                setResultsShowing(false);
                setSelectedEntryIndex(-1);
              }}
            />
          )}
        </Row>
      </Row>
      {/* Filter card */}
      {filterShowing && (
        <Card className="absolute left-0 right-0 z-50 translate-y-16 border-gray-200 bg-white py-3">
          {/* Score */}
          <Column className="gap-1 p-4">
            <label className="text-gray-400">Score</label>
            <Row className="items-end gap-3">
              <HappinessNumber
                value={startValue}
                onChangeValue={(v) => {
                  setStartValue(v);
                }}
                editable={true}
                sidebarStyle
              />
              <label className="text-gray-400">to</label>
              <HappinessNumber
                value={endValue}
                onChangeValue={(v) => {
                  setEndValue(v);
                }}
                editable
                sidebarStyle
              />
            </Row>
          </Column>

          {/* Date */}
          <Column className="gap-1 p-4">
            <label className="text-gray-400">Date</label>
            <Row className="items-end gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                className="flex-grow rounded-lg border-1 border-gray-300 px-4 py-1 uppercase text-gray-400"
              />
              <label className="text-gray-400">to</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                className="flex-grow rounded-lg border-1 border-gray-300 px-4 py-1 uppercase text-gray-400"
              />
            </Row>
          </Column>
          <Row className="items-end justify-end gap-4 px-4">
            <Button
              label="Search"
              variation="FILLED"
              size="SMALL"
              onClick={handleShowResults}
            />
            <label className="text-gray-400">or press ENTER</label>
          </Row>
        </Card>
      )}

      {/* Results preview */}
      {showResultsPreview && resultsShowing && (
        <Card className="absolute left-0 right-0 z-50 translate-y-16 border-gray-200">
          {data && data.length === 0 ? (
            <p className="mx-4 my-3 text-gray-400">
              {Object.keys(
                createSearchQuery(
                  text,
                  startDate,
                  endDate,
                  startValue,
                  endValue,
                ),
              ).length === 0
                ? "Type to search, or apply filters"
                : "No entries match the query"}
            </p>
          ) : (
            <>
              {data &&
                data.map((h, index) => (
                  <div
                    onMouseEnter={() => {
                      setSelectedEntryIndex(index);
                    }}
                    onMouseLeave={() => {
                      setSelectedEntryIndex(-1);
                    }}
                  >
                    <SearchResult
                      happiness={h}
                      keyword={text}
                      key={h.id}
                      selected={index === selectedEntryIndex}
                    />
                  </div>
                ))}
            </>
          )}
          {/* Footer */}
          <Row className="w-full border-t-1 border-gray-200 bg-gray-50 px-4 py-3">
            <label className="text-gray-400">
              Press ↑ or ↓ to navigate. Press ENTER or press button to open in
              Entries
            </label>
            <div className="flex flex-grow " />
            <a
              className={`${
                !count || count?.number === 0 ? "" : "underline"
              } text-sm text-gray-400 hover:cursor-pointer`}
            >
              {!count || count?.number === 0
                ? "No search results"
                : `View All${count ? ` ${count.number} ` : " "}Search Results`}
            </a>
          </Row>
        </Card>
      )}
    </Column>
  );
}
