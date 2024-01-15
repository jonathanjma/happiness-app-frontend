import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import { parseYYYYmmddFormat } from "../../utils";

export default function SearchResult({
  happiness,
  keyword,
  selected,
}: {
  happiness: Happiness;
  keyword: string;
  selected: boolean;
}) {
  const comment = happiness.comment;
  // Prepare highlighted text
  const highlightedKeyword = `<span class="text-gray-800 font-semibold text-md bg-yellow">${keyword}</span>`;

  const highlightedComment = comment
    .replace(new RegExp(keyword, "g"), highlightedKeyword)
    .substring(comment.indexOf(keyword) - 20);
  const sanitizedContent = DOMPurify.sanitize(highlightedComment);

  const navigate = useNavigate();

  return (
    <Row
      className={`w-full items-center ${
        selected ? "bg-gray-200" : "bg-white"
      } rounded-2xl`}
    >
      <span
        className={`my-4 ml-4 p-1 ${
          selected ? "bg-gray-50" : "bg-gray-200"
        } rounded-[4px]`}
      >
        <caption className=" text-gray-600">
          {happiness.value.toFixed(1)}
        </caption>
      </span>
      <div className="min-w-[12px]" />
      <div
        className="truncate text-sm text-gray-400"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      <div className="flex min-w-[32px] flex-grow" />
      {!selected && (
        <label className="mr-4 min-w-[100px] text-gray-600">
          {parseYYYYmmddFormat(happiness.timestamp).toLocaleDateString(
            "en-us",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          )}
        </label>
      )}
      {selected && (
        <button
          className="mr-4 h-10 min-w-[120px] rounded-lg bg-gray-50 p-1"
          onClick={() => {
            navigate(`/home?date=${happiness.timestamp}`);
          }}
        >
          <label className="text-gray-400 hover:cursor-pointer">
            Open in Entries
          </label>
        </button>
      )}
    </Row>
  );
}
