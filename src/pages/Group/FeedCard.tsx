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
import { useInView } from "react-intersection-observer";
import { useState } from "react";

// Card for happiness entries shown in group feed
export default function FeedCard({
  data,
  isNew,
  onClick,
  trackRead,
}: {
  data: Happiness;
  isNew: boolean;
  onClick: () => void;
  trackRead: boolean;
}) {
  const { api } = useApi();
  const commentsResult = useQuery<Comment[]>(
    [QueryKeys.FETCH_COMMENTS, { id: data.id }],
    () =>
      api
        .get<Comment[]>(`/happiness/${data.id}/comments`)
        .then((res) => res.data),
  );

  const [isFirstUpdate, setIsFirst] = useState(true);

  // if we are not tracking reads the entry can be assumed to have been read
  const [isRead, setIsRead] = useState(!trackRead);

  // used to detect if the user has scrolled past this entry so it can be marked as read
  const [readBoundaryRef] = useInView({
    skip: isRead,
    onChange: (status) => {
      // if going out of view and this is the first update, don't want to mark as read as it will either be:
      // off-screen (so not seen yet) or on-screen (doesn't matter since it's not off-screen yet)
      if (!status && !isFirstUpdate) {
        // console.log(`${data.author.username} ${data.timestamp} read`);
        // then() not needed since if the request fails it won't matter since this has no visual effect
        api.post("/reads/", { happiness_id: data.id });
        setIsRead(true);
      }
      if (isFirstUpdate) setIsFirst(false);
    },
  });

  return (
    <>
      <Card className="mb-4 border-0 p-4 hover:cursor-pointer">
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
          {/* Mark as read if user scrolls past this point */}
          <hr ref={readBoundaryRef} className="my-4 border-gray-100" />
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
