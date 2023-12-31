import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import { Happiness } from "../../data/models/Happiness";
import Card from "../../components/Card";
import TimeAgo from "javascript-time-ago";
import { dateFromStr } from "../../utils";
import CommentIcon from "../../assets/comment.svg";

export default function FeedCard({
  data,
  isNew,
  onClick,
}: {
  data: Happiness;
  isNew: boolean;
  onClick: () => void;
}) {
  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      <Card className="shadow-md2 mb-4 border-0 p-4 hover:cursor-pointer">
        <div data-hs-overlay="#happiness-viewer" onClick={onClick}>
          {/* Header */}
          <Row className="mb-4 items-center gap-x-2">
            <img
              src={data.author.profile_picture}
              className="max-w-[42px] rounded-full"
            />
            <Column className="flex-grow">
              <p className="text-gray-600">{data.author.username}</p>
              <Row className="gap-x-2">
                <label className="font-normal text-gray-400">
                  {timeAgo.format(dateFromStr(data.timestamp))}
                </label>
                {isNew && (
                  <div className="flex items-center justify-center rounded bg-yellow px-3 text-xs font-medium text-secondary">
                    New
                  </div>
                )}
              </Row>
            </Column>
            <h3 className="text-gray-600">{data.value.toFixed(1)}</h3>
          </Row>
          {/* Body */}
          <p className="line-clamp-3 p-0 font-normal text-gray-600">
            {data.comment}
          </p>
          <hr className="my-4 border-gray-100" />
          {/* Footer */}
          <Row className="items-center justify-between">
            <label className="font-normal text-gray-400">x Comments</label>
            <button className="rounded bg-gray-50 p-2">
              <Row className="gap-x-1">
                <img src={CommentIcon} className="max-h-[18px]" />
                <label className="font-normal leading-4 text-gray-400">
                  Comment
                </label>
              </Row>
            </button>
          </Row>
        </div>
      </Card>
    </>
  );
}
