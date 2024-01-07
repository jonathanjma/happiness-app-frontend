import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
import { formatDate, parseYYYYmmddFormat } from "../../utils";
import SearchResult from "./SearchResult";

export default function SearchBar() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  const { data } = useQuery<Happiness[]>({
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
      const query: Record<string, any> = {
        low: startValue,
        high: endValue,
        count: 5,
        text: text,
      };
      if (!isNaN(new Date(startDate).getTime())) {
        query.start = formatDate(parseYYYYmmddFormat(startDate));
      }
      if (!isNaN(new Date(endDate).getTime())) {
        query.end = formatDate(parseYYYYmmddFormat(endDate));
      }
      const res = await api.get<Happiness[]>("/happiness/search", query);
      return res.data;
    }
  });


  // Add keyboard listener for pressing enter and navigation between entries
  useEffect(() => {
    // handle when user presses enter to make a search or change selected entry
    // Initialization of this function must be done in use effect to prevent
    // data from being capturerd in closure
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (resultsShowing && selectedEntryIndex >= 0 && data && selectedEntryIndex < data.length) {
          navigate(`/home?date=${data[selectedEntryIndex].timestamp}`);
        } else {
          handleShowResults();
        }
      }
      if (event.key === "ArrowUp" && data && data.length > 0) {
        setSelectedEntryIndex((i) => (i - 1 < 0) ? data.length - 1 : i - 1);
      }
      if (event.key === "ArrowDown" && data && data.length > 0) {
        setSelectedEntryIndex((i) => {
          return (i + 1 >= data.length) ? 0 : i + 1;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [data, selectedEntryIndex]);

  return (
    <Column className="relative gap-4 z-50 w-full">
      {/* Search bar */}
      <Row className={`px-6 py-3 border-gray-300 rounded-[50px] border-1 items-center hover:border-gray-400 ${isFocused ? "shadow-form-selected border-yellow hover:border-yellow" : ""}`}>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); }}
          placeholder="Search for keywords"
          className="focus:outline-none w-auto flex-grow"
          onBlur={() => { setIsFocused(false); }}
          onFocus={() => { setIsFocused(true); }}
        />
        <Row className="gap-4">
          <IconFilter color="#808080" className="hover:cursor-pointer" onClick={handleToggleFilter} />
          {text.length !== 0 &&
            <IconClose
              color="#808080"
              className="hover:cursor-pointer"
              onClick={() => {
                setText("");
                setResultsShowing(false);
                setSelectedEntryIndex(-1);
              }}
            />
          }
        </Row>
      </Row>
      {/* Filter card */}
      {filterShowing &&
        <Card
          className={`z-50 left-0 right-0 absolute translate-y-16 py-3 shadow-md2 border-1 border-gray-200 bg-white`}
        >
          {/* Score */}
          <Column className="p-4 gap-1">
            <label className="text-gray-400">Score</label>
            <Row className="gap-3 items-end">
              <HappinessNumber
                value={startValue}
                onChangeValue={(v) => { setStartValue(v); }}
                editable={true}
                sidebarStyle
              />
              <label className="text-gray-400">to</label>
              <HappinessNumber
                value={endValue}
                onChangeValue={(v) => { setEndValue(v); }}
                editable
                sidebarStyle
              />
            </Row>
          </Column>

          {/* Date */}
          <Column className="p-4 gap-1">
            <label className="text-gray-400">Date</label>
            <Row className="gap-3 items-end">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate((e.target.value)); }}
                className="text-gray-400 border-gray-300 border-1 px-4 py-1 rounded-lg uppercase flex-grow"
              />
              <label className="text-gray-400">to</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate((e.target.value)); }}
                className="text-gray-400 border-gray-300 border-1 px-4 py-1 rounded-lg uppercase flex-grow"
              />
            </Row>
          </Column>
          <Row className="gap-4 px-4 justify-end items-end">
            <Button label="Search" variation="FILLED" size="SMALL" onClick={handleShowResults} />
            <label className="text-gray-400">or press ENTER</label>
          </Row>
        </Card>
      }

      {/* Results preview */}
      {resultsShowing &&
        <Card className="absolute translate-y-16 left-0 right-0 border-gray-200 shadow-md2 z-50">
          {data && data.length === 0 ? <p className="mx-4 my-3 text-gray-400">No entries match the query</p> :
            <>
              {data && data.map((h, index) =>
                <div
                  onMouseEnter={() => { setSelectedEntryIndex(index); }}
                  onMouseLeave={() => { setSelectedEntryIndex(-1); }}
                >
                  <SearchResult
                    happiness={h}
                    keyword={text}
                    key={h.id}
                    selected={index === selectedEntryIndex}
                  />
                </div>
              )}
            </>
          }
          {/* Footer */}
          <Row className="px-4 py-3 w-full bg-gray-50 border-t-1 border-gray-200">
            <label className="text-gray-400">Press ↑ or ↓ to navigate. Press ENTER or press button to open in Entries</label>
            <div className="flex flex-grow " />
            <a className="underline text-sm text-gray-400 hover:cursor-pointer">View All Search Results</a>
          </Row>
        </Card>
      }
    </Column>
  );
}

