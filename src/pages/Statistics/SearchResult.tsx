import { useState } from "react";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";

export default function SearchResult({ happiness, keyword }: {
  happiness: Happiness;
  keyword: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const processedComment = happiness.comment;
  const highlightedKeyword = `<span class="text-gray-800 font-semibold text-md bg-yellow">${keyword}</span>`;
  const highlightedComment = processedComment
    .replace(new RegExp(`\\b${keyword}\\b`, 'g'), highlightedKeyword)
    .substring(processedComment.indexOf(keyword));

  return (
    <Row className={`items-center w-full ${isHovered ? "bg-gray-200" : "bg-white"} rounded-2xl`}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}>
      <span className={`ml-4 my-4 p-1 ${isHovered ? "bg-gray-50" : "bg-gray-200"} rounded-[4px]`} >
        <caption className=" text-gray-600">{happiness.value.toFixed(1)}</caption>
      </span>
      <div className="min-w-[12px]" />
      <div className="text-gray-400 truncate text-sm" dangerouslySetInnerHTML={{ __html: highlightedComment }} />
      <div className="flex flex-grow min-w-[32px]" />
      {!isHovered && <label className="text-gray-600 mr-4 min-w-[100px]">{new Date(happiness.timestamp).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}</label>}
      {isHovered &&
        <button className="bg-gray-50 rounded-lg p-1 h-10 mr-4 min-w-[120px]" >
          <label className="text-gray-400 hover:cursor-pointer">
            Open in Entries
          </label>
        </button>
      }
    </Row>
  );
}
