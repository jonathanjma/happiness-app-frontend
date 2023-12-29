import { useState } from "react";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";

export default function SearchResult({ happiness, keyword }: {
  happiness: Happiness;
  keyword: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  // TODO replace global padding with margin so I can use button according to design
  const processedComment = happiness.comment.split(" ");
  const importantSection = processedComment.slice(processedComment.indexOf(keyword) - 3);
  const before = importantSection.slice(0, 3).join(" ");
  const after = importantSection.slice(processedComment.indexOf(keyword)).join(" ");

  return (
    <Row className={`items-center ${isHovered ? "bg-gray-200" : "bg-white"} rounded-2xl`}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}>
      <span className={`ml-4 my-4 p-1 ${isHovered ? "bg-gray-50" : "bg-gray-200"} rounded-[4px]`} >
        <caption className=" text-gray-600">{happiness.value.toFixed(1)}</caption>
      </span>
      <div className="w-3" />

      <span className="text-gray-400 text-sm">
        {before}
      </span>
      <span className="text-gray-800 font-semibold text-sm bg-yellow">
        {keyword}
      </span>
      <span className="text-gray-400 text-sm">
        {after}
      </span>

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
