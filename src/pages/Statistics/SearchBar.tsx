import { useState } from "react";
import IconClose from "../../assets/IconClose";
import IconFilter from "../../assets/IconFilter";
import Button from "../../components/Button";
import Card from "../../components/Card";
import HappinessNumber from "../../components/HappinessNumber";
import TextField from "../../components/TextArea";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
export default function SearchBar() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [happinessRangeStart, setHappinessRangeStart] = useState(0);
  const [happinessRangeEnd, setHappinessRangeEnd] = useState(10);


  const FilterCard = () =>
    <Card className="py-3 shadow-md2 border-1 border-gray-200">
      {/* Score */}
      <Column className="p-4 gap-1">
        <label className="text-gray-400">Score</label>
        <Row className="gap-3 items-end">
          <HappinessNumber
            value={happinessRangeStart}
            onChangeValue={(v) => { setHappinessRangeStart(v); }}
            editable={true}
            sidebarStyle
          />
          <label className="text-gray-400">to</label>
          <HappinessNumber
            value={happinessRangeEnd}
            onChangeValue={(v) => { setHappinessRangeEnd(v); }}
            editable
            sidebarStyle
          />
        </Row>
      </Column>

      {/* Date */}
      <Column className="p-4 gap-1">
        <label className="text-gray-400">Date</label>
        <Row className="gap-3">
          <TextField
            value=""
            hint="MM / DD / YYYY"
            onChangeValue={() => { }}
          />
          <label className="text-gray-400">to</label>
          <TextField
            value=""
            hint="MM / DD / YYYY"
            onChangeValue={() => { }}
          />
        </Row>
      </Column>
      <Row className="gap-4 px-4 justify-end items-end">
        <Button label="Search" variation="FILLED" size="SMALL" />
        <label className="text-gray-400">or press ENTER</label>
      </Row>
    </Card>;

  return (
    <Column className="gap-4">
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
          <IconFilter color="#808080" className="hover:cursor-pointer" />
          {text.length !== 0 &&
            <IconClose
              color="#808080"
              className="hover:cursor-pointer"
              onClick={() => { setText(""); }}
            />
          }
        </Row>
      </Row>
      <FilterCard />
    </Column>

  );
}
