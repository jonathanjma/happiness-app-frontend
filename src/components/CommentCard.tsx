import Column from "./layout/Column";
import Row from "./layout/Row";
import { Comment } from "../data/models/Comment";
import TimeAgo from "javascript-time-ago";

/**
 * The type of comment card to display on the big entry card. Text styles are
 * not in-place yet since we are waiting on a fix from design.
 * @param comment the comment to display in the card
 * @returns
 */
export default function CommentCard({ comment }: { comment: Comment }) {
  const timeAgo = new TimeAgo("en-US");
  return (
    <Row className="px-6 py-4">
      <img
        className="h-10 w-10 rounded-full"
        src={comment.author.profile_picture}
      />
      <div className="w-4" />
      <Column className="gap-2">
        <h6 className="font-semibold leading-4 text-gray-400">
          {comment.author.username}
        </h6>
        <p className="leading-5 text-gray-600"> {comment.text} </p>
        <label className=" leading-4 text-gray-400">
          {timeAgo.format(new Date(comment.timestamp))}
        </label>
      </Column>
    </Row>
  );
}
