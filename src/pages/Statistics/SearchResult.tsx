import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import { parseYYYYmmddFormat } from "../../utils";

export default function SearchResult({ happiness, keyword, selected }: {
  happiness: Happiness;
  keyword: string;
  selected: boolean;
}) {
  const comment = happiness.comment;
  // Prepare highlighted text
  const highlightedKeyword = `<span class="text-gray-800 font-semibold text-md bg-yellow">${keyword}</span>`;

  const highlightedComment = comment
    .replace(new RegExp(`${keyword}`, 'g'), highlightedKeyword)
    .substring(comment.indexOf(keyword) - 20);
  const sanitizedContent = DOMPurify.sanitize(highlightedComment);

  const navigate = useNavigate();

  return (
    <Row className={`items-center w-full ${selected ? "bg-gray-200" : "bg-white"} rounded-2xl`}>
      <span className={`ml-4 my-4 p-1 ${selected ? "bg-gray-50" : "bg-gray-200"} rounded-[4px]`} >
        <caption className=" text-gray-600">{happiness.value.toFixed(1)}</caption>
      </span>
      <div className="min-w-[12px]" />
      <div className="text-gray-400 truncate text-sm" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <div className="flex flex-grow min-w-[32px]" />
      {!selected && <label className="text-gray-600 mr-4 min-w-[100px]">{parseYYYYmmddFormat(happiness.timestamp).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}</label>}
      {selected &&
        <button className="bg-gray-50 rounded-lg p-1 h-10 mr-4 min-w-[120px]"
          onClick={() => {
            navigate(`/home?date=${happiness.timestamp}`);
          }}
        >
          <label className="text-gray-400 hover:cursor-pointer">
            Open in Entries
          </label>
        </button>
      }
    </Row>
  );
}
