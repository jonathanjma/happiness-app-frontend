import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import { Happiness } from "../../data/models/Happiness";
import Card from "../../components/Card";
import CommentIcon from "../../assets/comment.svg";
import { useQuery } from "react-query";
import { Comment } from "../../data/models/Comment";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import { dateOrTodayYesterday } from "./GroupFeed";
import { dateFromStr } from "../../utils";

export default function FeedCard({
  data,
  isNew,
  onClick,
}: {
  data: Happiness;
  isNew: boolean;
  onClick: () => void;
}) {
  const { api } = useApi();
  const commentsResult = useQuery<Comment[]>(
    [QueryKeys.FETCH_COMMENTS, { id: data.id }],
    () =>
      api
        .get<Comment[]>(`/happiness/${data.id}/comments`)
        .then((res) => res.data),
  );

  return (
    <>
      <Card className="mb-4 border-0 p-4 shadow-md2 hover:cursor-pointer">
        <div data-hs-overlay="#happiness-viewer" onClick={onClick}>
          {/* Header: user details, unread indicator, and score */}
          <Row className="mb-4 items-center gap-x-2">
            <img
              src={data.author.profile_picture}
              className="max-w-[42px] rounded-full"
            />
            <Column className="flex-grow">
              <p className="text-gray-600">{data.author.username}</p>
              <Row className="gap-x-2">
                <label className="font-normal text-gray-400">
                  {dateOrTodayYesterday(
                    data.timestamp,
                    dateFromStr(data.timestamp).toLocaleString("en-us", {
                      month: "long",
                      day: "numeric",
                    }),
                  )}
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
          {/* Body: entry comment */}
          <p className="line-clamp-3 p-0 font-normal text-gray-600">
            {data.comment}
          </p>
          <hr className="my-4 border-gray-100" />
          {/* Footer: discussion comment info */}
          <Row className="items-center justify-between">
            {commentsResult.isLoading ? (
              <Spinner />
            ) : (
              <label className="font-normal text-gray-400">
                {commentsResult.isError
                  ? "Could not load comments."
                  : commentsResult.data!.length + " Comments"}
              </label>
            )}
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
