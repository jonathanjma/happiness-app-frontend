import { createRef, useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import { Comment } from "../../data/models/Comment";
import CommentCard from "./CommentCard";

export default function Comments({
  commentsResult,
}: {
  commentsResult: UseQueryResult<Comment[]>;
}) {
  const commentsContainer = createRef<HTMLDivElement>();
  const [dividerOpacity, setDividerOpacity] = useState(100);

  // When the user scrolls we want the divider to fade out:
  useEffect(() => {
    const comments = commentsContainer.current;
    if (comments != null) {
      const handleScroll = () => {
        if (comments.scrollTop === 0) {
          setDividerOpacity(0);
        } else {
          setDividerOpacity(100);
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
        className={
          "opacity- h-0.25 w-full bg-gray-200 transition-opacity duration-500" +
          dividerOpacity
        }
      />
      {myComments.length === 0 ? (
        <p className="mt-8">Nothing to see here!</p>
      ) : (
        <div className="overflow-auto" ref={commentsContainer}>
          {myComments.map((c, _) => (
            <CommentCard comment={c} key={c.id} />
          ))}
        </div>
      )}
    </>
  );
}
