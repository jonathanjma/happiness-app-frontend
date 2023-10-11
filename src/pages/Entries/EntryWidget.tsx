import { useEffect } from "react";
import { useApi } from "../../contexts/ApiProvider";
import { useQuery } from "react-query";
import Spinner from "../../components/Spinner";
import CommentCard from "./CommentCard";
import { Happiness } from "../../data/models/Happiness";
import { Comment } from "../../data/models/Comment";
// import { ReactComponent as EditIcon } from "../../assets/edit.svg";

export default function EntryWidget({ entryData }: { entryData: Happiness }) {
  const { api } = useApi();

  const commentsResult = useQuery<Comment[]>(
    [`happinessComments ${entryData.id}`],
    () =>
      entryData.id >= 0
        ? api
            .get<Comment[]>(`/happiness/${entryData.id}/comments`)
            .then((res) => res.data)
        : [],
  );
  useEffect(() => {
    console.log("COMMENTS DATA");
    console.log(commentsResult.data);
  }, [commentsResult.data]);

  const Comments = () => {
    if (
      commentsResult.isLoading ||
      commentsResult.isError ||
      commentsResult.data == null
    ) {
      return (
        <>
          <Spinner />
        </>
      );
    }

    return (
      <div className="overflow-auto h-full">
        {commentsResult.data.length === 0 ? (
          <p className="mt-8">Nothing here yet</p>
        ) : (
          commentsResult.data.map((item) => (
            <CommentCard key={item.id} commentData={item} />
          ))
        )}
      </div>
    );
  };

  const CommentHeader = () => {
    if (
      commentsResult.isLoading ||
      commentsResult.isError ||
      commentsResult.data == null
    ) {
      return (
        <>
          <h5 className="h5 border-solid border-[#E4E0E0] border-b-2 border-x-0 border-t-0 py-0.5">
            Comments
          </h5>
        </>
      );
    }
    return (
      <h5 className="h5 border-solid border-[#E4E0E0] border-b-2 border-x-0 border-t-0 py-0.5">
        {commentsResult.data.length === 0
          ? "Comments"
          : `Comments (${commentsResult.data.length})`}
      </h5>
    );
  };

  return (
    <div
      className={
        "flex flex-col w-full items-stretch bg-white rounded-2xl mt-8 mb-4 mx-8 shadow-heavy"
      }
    >
      {/* date, public entry, score, comment, and edit button are here */}
      <div className="flex flex-col mt-8 mx-8 h-1/12 flex-1">
        {/* Date */}

        {/* Public entry and edit button */}
        <div className="flex flex-row">
          <p className="body1">You don't have a private entry</p>
          {/*<div width={12} />*/}
          <div>
            <p
              className="clickable-text underline leading-4 hover:cursor-pointer"
              onClick={() => {
                console.log("navigate to journal");
              }}
            >
              Create a private entry
            </p>
          </div>
        </div>
        <div className="flex flex-row pt-4">
          <div className="flex flex-col">
            <h5 className="font-medium">Public Entry</h5>
            <p className="subheader">
              {new Date(entryData.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex-1" />
          <button
            type="button"
            className="bg-[#F7EFD7] py-3 pl-3 normal-case clickable-text rounded-xl shadow-medium text-sm"
          >
            {/*<EditIcon />*/}
            Edit Entry
          </button>
        </div>
        {/* Happiness score and entry box */}
        <div className="mt-6 flex flex-row w-full">
          <div className="w-20 h-20 items-center justify-center flex flex-col ">
            <h1 className="score-text">{entryData.value}</h1>
          </div>
          <div className="ml-6 flex-1 ">
            <h4 className="body1">{entryData.comment}</h4>
          </div>
        </div>
      </div>
      {/* Comments */}
      <div className="flex flex-col mx-8 mt-8 h-[58%]">
        <CommentHeader />
        <div
          className="w-full h-[calc(100vh-200px)] border-1 overflow-auto"
          // height={500}
        >
          <Comments />
        </div>
      </div>
    </div>
  );
}
