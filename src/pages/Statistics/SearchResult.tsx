import { useState } from "react";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";

export default function SearchResult({ happiness, keyword }: {
  happiness: Happiness;
  keyword: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  // TODO replace global padding with margin so I can use button according to design
  return (
    <Row className={`p-4 items-center ${isHovered ? "bg-gray-200" : "bg-white"} rounded-2xl`}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(true); }}>
      <span className={`p-1 ${isHovered ? "bg-gray-50" : "bg-gray-200"} rounded-[4px]`} >
        <caption className=" text-gray-600">{happiness.value.toFixed(1)}</caption>
      </span>
      <div className="w-3" />
      <label className="truncate w-5/6 text-gray-400">{happiness.comment}</label>
      <div className="flex flex-grow" />
      {!isHovered && <label className="text-gray-600">{new Date(happiness.timestamp).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}</label>}
      {isHovered &&
        <button className="absolute end-0 -translate-x-12 bg-gray-50 rounded-lg p-1 h-10" >
          <label className="text-gray-400">
            Open in Entries
          </label>
        </button>
      }
    </Row>
  );
}
