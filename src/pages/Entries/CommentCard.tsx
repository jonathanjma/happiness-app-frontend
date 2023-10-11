import Card from "../../components/Card";
import { Comment } from "../../data/models/Comment";

export default function CommentCard({ commentData }: { commentData: Comment }) {
  let groupName = "Cornell"; // *** update
  return (
    <Card className="rounded-xl py-4 px-6">
      <div className="flex flex-row">
        <img src={commentData.author.profilePicture} />
        <div className="w-4" />
        <div className="flex flex-col">
          <p className="comment-header">
            {commentData.author.username + " • " + groupName}
          </p>
          <p className="comment-body"> {commentData.text} </p>
          <p className="body2-grey">{commentData.timestamp} </p>
        </div>
      </div>
    </Card>
  );
}
