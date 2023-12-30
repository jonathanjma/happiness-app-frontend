import DOMPurify from "dompurify";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";

export default function SearchResult({ happiness, keyword, selected }: {
  happiness: Happiness;
  keyword: string;
  selected: boolean;
}) {
  const processedComment = happiness.comment;
  const highlightedKeyword = `<span class="text-gray-800 font-semibold text-md bg-yellow">${keyword}</span>`;
  const highlightedComment = processedComment
    .replace(new RegExp(`${keyword}`, 'g'), highlightedKeyword)
    .substring(processedComment.indexOf(keyword) - 20);
  const sanitizedContent = DOMPurify.sanitize(highlightedComment);
  // TODO change to trying to start at full words before but if it's too long then don't
  // TODO make sure search only updates when user presses enter or do the displayed text vs searched text thing
  // TODO almost done! Just cleanup first down press then enter not working

  return (
    <Row className={`items-center w-full ${selected ? "bg-gray-200" : "bg-white"} rounded-2xl`}>
      <span className={`ml-4 my-4 p-1 ${selected ? "bg-gray-50" : "bg-gray-200"} rounded-[4px]`} >
        <caption className=" text-gray-600">{happiness.value.toFixed(1)}</caption>
      </span>
      <div className="min-w-[12px]" />
      <div className="text-gray-400 truncate text-sm" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <div className="flex flex-grow min-w-[32px]" />
      {!selected && <label className="text-gray-600 mr-4 min-w-[100px]">{new Date(happiness.timestamp).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}</label>}
      {selected &&
        <button className="bg-gray-50 rounded-lg p-1 h-10 mr-4 min-w-[120px]"
          onClick={() => {
            // TODO open entry
            console.log(`opening entry for happiness ${happiness.comment}`);
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
