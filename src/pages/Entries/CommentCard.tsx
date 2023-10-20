import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { Comment } from "../../data/models/Comment";

/**
 * The type of comment card to display on the big entry card. Text styles are
 * not in-place yet since we are waiting on a fix from design.
 * @param comment the comment to display in the card
 * @returns
 */
export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <Row className="py-4 px-6">
      <img
        className="rounded-full h-10 w-10"
        src={comment.author.profilePicture}
      />
      <div className="w-4" />
      <Column className="gap-0.25">
        <h6>{comment.author.username}</h6>
        <p> {comment.text} </p>
        <p> {comment.timestamp} </p>
      </Column>
    </Row>
  );
}
