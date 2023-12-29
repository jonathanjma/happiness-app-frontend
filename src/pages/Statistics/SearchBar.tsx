import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
import { formatDate } from "../../utils";
import SearchResult from "./SearchResult";

export default function SearchBar() {
  const [text, setText] = useState("dinner");
  const [isFocused, setIsFocused] = useState(false);

  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(10);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [filterShowing, setFilterShowing] = useState(false);
  const [resultsShowing, setResultsShowing] = useState(false);


  const { api } = useApi();
  const { data, isLoading, isError } = useQuery<Happiness[]>({
    queryKey: [
      QueryKeys.FETCH_HAPPINESS,
      { start: formatDate(new Date(startDate?.valueOf())) },
      { end: formatDate(endDate) },
      { low: startValue },
      { high: endValue },
      { count: 5 },
      { text: text },
    ],
    queryFn: async () => {
      const res = await api.get<Happiness[]>("/happiness/search", {
        start: formatDate(startDate),
        end: formatDate(endDate),
        low: startValue,
        high: endValue,
        count: 5,
        text: text,
      });
      return res.data;
    }
  });

  useEffect(() => {
  });

  return (
    <Column className="gap-4 z-50 w-full border-secondary border-2">
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
          <IconFilter color="#808080" className="hover:cursor-pointer" onClick={() => { setFilterShowing((showing) => !showing); }} />
          {text.length !== 0 &&
            <IconClose
              color="#808080"
              className="hover:cursor-pointer"
              onClick={() => { setText(""); }}
            />
          }
        </Row>
      </Row>
      {/* Filter card */}
      {filterShowing &&
        <Card
          className={`z-50 absolute translate-y-16 py-3 shadow-md2 border-1 border-gray-200 hs-dropdown-menu transition-[opacity,margin] duration`}
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
              <label className="text-gray-400">to</label>
            </Row>
          </Column>
          <Row className="gap-4 px-4 justify-end items-end">
            <Button label="Search" variation="FILLED" size="SMALL" />
            <label className="text-gray-400">or press ENTER</label>
          </Row>
        </Card>}

      {/* Results preview */}
      {resultsShowing &&
        <Card className="absolute border-gray-200 shadow-md2 w-full">
          {data &&
            data.map((h) => <SearchResult happiness={h} keyword={text} />)
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

