import { useState } from "react";
import { useLocation } from "react-router-dom";
import Column from "../../components/layout/Column";
import SearchBar from "./SearchBar";

export default function Statistics() {
  const location = useLocation();
  const [text, setText] = useState(location?.state?.text ?? "");
  const [startValue, setStartValue] = useState(
    location?.state?.startValue ?? 0,
  );
  const [endValue, setEndValue] = useState(location?.state?.endValue ?? 10);
  const [startDate, setStartDate] = useState(location?.state?.startDate ?? "");
  const [endDate, setEndDate] = useState(location?.state?.endDate ?? "");

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
