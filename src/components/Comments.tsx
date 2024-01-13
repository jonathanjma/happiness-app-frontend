import { createRef, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { Comment } from "../data/models/Comment";
import { getDateObjFromUTCString } from "../utils";
import CommentCard from "./CommentCard";
import TextField from "./TextField";
import Row from "./layout/Row";
import CommentCardSkeleton from "./skeletons/CommentCardSkeleton";

interface PostComment {
  text: string;
}

export default function Comments({
  associatedHappinessId,
  canAddComment = false,
  modalVariant = false,
}: {
  associatedHappinessId: number;
  canAddComment?: boolean;
  modalVariant?: boolean;
}) {
  const commentsContainer = createRef<HTMLDivElement>();
  const [dividerOpacity, setDividerOpacity] = useState(100);
  const { api } = useApi();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [comment, setComment] = useState("");

  // Set up post comment mutation and function
  const postCommentMutation = useMutation(
    (newComment: PostComment) =>
      api.post<Comment>(
        `/happiness/${associatedHappinessId}/comment`,
        newComment,
      ),
    {
      onSuccess: (res) => {
        queryClient.setQueryData<Comment[]>(
          [QueryKeys.FETCH_COMMENTS, { id: associatedHappinessId }],
          (prevData) => (prevData ? [res.data, ...prevData] : [res.data]),
        );
        setComment("");
      },
    },
  );
  const postComment = () => {
    if (comment.trim().length > 0) {
      postCommentMutation.mutate({ text: comment });
    }
  };

  // Fetch comments
  const commentsResult = useQuery<Comment[]>(
    [QueryKeys.FETCH_COMMENTS, { id: associatedHappinessId }],
    () => {
      if (associatedHappinessId >= 0) {
        return api
          .get<Comment[]>(`/happiness/${associatedHappinessId}/comments`)
          .then((res) => {
            return res.data.map((comment) => {
              const estDate = getDateObjFromUTCString(comment.timestamp);
              comment.timestamp = estDate.toLocaleString();

              return comment;
            });
          });
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

  // React to comments data
  if (commentsResult.isLoading) {
    return (
      <>
        <h5
          className={`my-1 ${modalVariant ? "text-gray-400" : "text-gray-800"}`}
        >
          Comments loading...
        </h5>
        <div className="h-0.25 w-full bg-gray-200" />

        <div className="overflow-auto" ref={commentsContainer}>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <CommentCardSkeleton key={i} />
            ))}
        </div>
      </>
    );
  }
  if (commentsResult.isError) {
    return <p>Error loading comments</p>;
  }
  const myComments: Comment[] = commentsResult.data!;

  return (
    <>
      <h5
        className={`my-1 ${modalVariant ? "text-gray-400" : "text-gray-800"}`}
      >
        {myComments.length === 0
          ? "Comments"
          : `Comments (${myComments.length})`}
      </h5>
      <div
        className={`h-0.25 w-full bg-gray-200 transition-opacity duration-500 opacity-${dividerOpacity}`}
      />

      {canAddComment && user && (
        <Row className="gap-4 px-6 py-4">
          <img className="h-10 w-10 rounded-full" src={user.profile_picture} />
          <TextField
            className="flex flex-1"
            value={comment}
            onChangeValue={setComment}
            hint="Write a comment"
            onEnterPressed={postComment}
            innerIcon={
              <button className="h-6" onClick={postComment}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.723 12.8385L4.76537 18.7231C4.46411 18.8436 4.1779 18.8176 3.90675 18.6452C3.63558 18.4727 3.5 18.2224 3.5 17.8942V6.10586C3.5 5.77764 3.63558 5.52731 3.90675 5.35488C4.1779 5.18245 4.46411 5.15649 4.76537 5.27701L18.723 11.1616C19.0948 11.3257 19.2806 11.6052 19.2806 12C19.2806 12.3949 19.0948 12.6744 18.723 12.8385ZM4.99997 17L16.85 12L4.99997 7.00003V10.6924L10.423 12L4.99997 13.3077V17Z"
                    fill="#808080"
                  />
                </svg>
              </button>
            }
          />
        </Row>
      )}

      {myComments.length === 0 && <p className="mt-8">Nothing to see here!</p>}

      <div className="overflow-auto" ref={commentsContainer}>
        {postCommentMutation.isLoading && <CommentCardSkeleton />}
        {myComments.map((c, _) => (
          <CommentCard comment={c} key={c.id} />
        ))}
      </div>
    </>
  );
}
