import { useState } from "react";
import Column from "../../components/layout/Column";
import SearchBar from "./SearchBar";

export default function Statistics() {
  const [text, setText] = useState("");
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <Column className="w-3/4 items-stretch gap-8 px-8 py-24">
      <h1>Statistics</h1>
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
      />
    </Column>
  );
}
