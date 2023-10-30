import { useQuery } from "react-query";
import EditIcon from "../../assets/EditIcon";
import Button from "../../components/Button";
import HappinessNumber from "../../components/HappinessNumber";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { useApi } from "../../contexts/ApiProvider";
import { Comment } from "../../data/models/Comment";
import { Happiness } from "../../data/models/Happiness";
import Comments from "./Comments";
import { useEffect } from "react";

/**
 * The Big Entry Card component to display an entry on the entries page
 * @param className style to add to the entry card, overrides default styles
 * @param happiness the Happiness object to display on the entry card.
 * If the happiness value is negative one it represents no happiness for this day
 * @returns
 */
export default function EntryCard({
  className,
  happiness,
  onChangeHappinessNumber,
  onChangeCommentText,
  editing,
  setEditing,
}: {
  happiness: Happiness;
  className?: string;
  onChangeHappinessNumber: (value: number) => void;
  onChangeCommentText: (value: string) => void;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { api } = useApi();

  // Fetch comments
  const commentsResult = useQuery<Comment[]>(
    [`happinessComments ${happiness.id}`],
    () => {
      if (happiness.id >= 0) {
        return api
          .get<Comment[]>(`/happiness/${happiness.id}/comments`)
          .then((res) => res.data);
      }
      return [];
    },
  );

  return (
    <Column
      className={
        "bg-white flex-1 items-stretch rounded-2xl p-6 shadow-2xl " + className
      }
    >
      {/* Header text */}
      <Row className="items-center">
        <p className="text-dark_gray">You don't have a private entry</p>
        <span className="w-3" />
        <p
          className="clickable-text font-semibold leading-4 text-secondary underline hover:cursor-pointer"
          onClick={() => {
            console.log("TODO open private entries page");
          }}
        >
          Create a Private Entry
        </p>
      </Row>

      <div className=" h-4" />

      {/* Public entry and edit button */}
      <Row>
        <Column>
          <h4>Public Entry</h4>
          <h5 className=" text-dark_gray">
            {new Date(happiness.timestamp).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </h5>
        </Column>
        <div className="flex-1" />
        <Button
          label="Edit Entry"
          icon={<EditIcon />}
          onClick={() => {
            setEditing((e) => !e);
          }}
        />
      </Row>
      {/* Entry and score */}
      <Row className="mt-6 h-1/4  w-full">
        <Column className="border-primary-500 flex h-full min-w-[80px] items-center ">
          <HappinessNumber
            value={happiness.value}
            onChangeValue={onChangeHappinessNumber}
            editable={editing}
          />
        </Column>
        <div className=" w-6" />
        <textarea
          placeholder="Write about your day"
          className={
            "h-full w-full resize-none rounded-lg bg-transparent focus:outline-none " +
            (happiness.value === -1
              ? "bg-gray-50 p-5"
              : editing
              ? "border-1 border-solid border-gray-200 p-5"
              : "")
          }
          value={happiness.comment}
          disabled={!editing}
          onChange={(e) => {
            onChangeCommentText(e.target.value);
          }}
        />
      </Row>
      <div className="h-8" />
      {/* Comments */}
      <Column className="h-0 w-full flex-1 items-stretch">
        <Comments commentsResult={commentsResult} />
      </Column>
    </Column>
  );
}
