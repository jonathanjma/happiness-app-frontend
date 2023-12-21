import { createRef, useEffect, useState } from "react";
import { UseQueryResult, useQuery } from "react-query";
import { Comment } from "../data/models/Comment";
import CommentCard from "./CommentCard";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import Row from "./layout/Row";
import { useUser } from "../contexts/UserProvider";
import TextField from "./TextArea";

export default function Comments({
  associatedHappinessId,
  canAddComment = false,
}: {
  associatedHappinessId: number;
  canAddComment?: boolean;
}) {
  const commentsContainer = createRef<HTMLDivElement>();
  const [dividerOpacity, setDividerOpacity] = useState(100);
  const { api } = useApi();
  const { user } = useUser();


  const [comment, setComment] = useState("");

  // Fetch comments
  const commentsResult = useQuery<Comment[]>(
    QueryKeys.FETCH_COMMENTS + associatedHappinessId,
    () => {
      if (associatedHappinessId >= 0) {
        return api
          .get<Comment[]>(`/happiness/${associatedHappinessId}/comments`)
          .then((res) => res.data);
      }
      return [];
    },
  );

  // When the user scrolls we want the divider to fade out:
  useEffect(() => {
    const comments = commentsContainer.current;
    if (comments != null) {
      const handleScroll = () => {
        if (comments.scrollTop === 0) {
          setDividerOpacity(100);
        } else {
          setDividerOpacity(0);
        }
      };
      comments.addEventListener("scroll", handleScroll);
      return () => {
        comments.removeEventListener("scroll", handleScroll);
      };
    }
  }, [commentsContainer]);

  if (commentsResult.isLoading) {
    return (
      <>
        <h5 className="my-0.25">Comments loading...</h5>
        <div className="h-0.25 w-full bg-gray-200" />
      </>
    );
  }
  if (commentsResult.isError) {
    return <p>Error loading comments</p>;
  }
  const myComments: Comment[] = commentsResult.data!;
  return (
    <>
      <h5 className="my-0.25 ">
        {myComments.length === 0
          ? "Comments"
          : `Comments (${myComments.length})`}
      </h5>
      <div
        className={`h-0.25 w-full bg-gray-200 transition-opacity duration-500 opacity-${dividerOpacity}`}
      />

      {canAddComment && user &&
        <Row className="py-4 px-6 gap-4">
          <img className="w-10 h-10 rounded-full" src={user.profile_picture} />
          <TextField
            value={comment}
            onChangeValue={setComment}
            hint="Write a comment"
            innerIcon={
              <button onClick={() => { console.log(`hi`); /* TODO post comment */ }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18.723 12.8385L4.76537 18.7231C4.46411 18.8436 4.1779 18.8176 3.90675 18.6452C3.63558 18.4727 3.5 18.2224 3.5 17.8942V6.10586C3.5 5.77764 3.63558 5.52731 3.90675 5.35488C4.1779 5.18245 4.46411 5.15649 4.76537 5.27701L18.723 11.1616C19.0948 11.3257 19.2806 11.6052 19.2806 12C19.2806 12.3949 19.0948 12.6744 18.723 12.8385ZM4.99997 17L16.85 12L4.99997 7.00003V10.6924L10.423 12L4.99997 13.3077V17Z" fill="#808080" />
                </svg>
              </button>
            }
          />
        </Row>
      }

      {myComments.length === 0 &&
        <p className="mt-8">Nothing to see here!</p>}

      <div className="overflow-auto" ref={commentsContainer}>

        {myComments.map((c, _) => (
          <CommentCard comment={c} key={c.id} />
        ))}
      </div>

    </>
  );
}
