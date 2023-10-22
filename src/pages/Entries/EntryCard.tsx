import { useState } from "react";
import { useQuery } from "react-query";
import EditIcon from "../../assets/EditIcon";
import Button from "../../components/Button";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { useApi } from "../../contexts/ApiProvider";
import { Comment } from "../../data/models/Comment";
import { Happiness } from "../../data/models/Happiness";
import Comments from "./Comments";

/**
 * The Big Entry Card component to display an entry on the entries page
 * @param className style to add to the entry card, overrides default styles
 * @param happiness the Happiness object to display on the entry card
 * @returns
 */
export default function EntryCard({
  className,
  happiness,
}: {
  happiness: Happiness;
  className?: string;
}) {
  const { api } = useApi();
  const [dividerOpacity, setDividerOpacity] = useState(100);

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
        "items-stretch flex-1 bg-white rounded-2xl shadow-2xl p-6 " + className
      }
    >
      {/* Header text */}
      <Row className="items-center">
        <p className="text-dark_gray">You don't have a private entry</p>
        <span className="w-3" />
        <p
          className="clickable-text underline leading-4 hover:cursor-pointer text-secondary font-semibold"
          onClick={() => {
            console.log("TODO navigate to journal");
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
        <Button label="Edit Entry" icon={<EditIcon />} />
      </Row>
      {/* Entry and score */}
      <Row className="mt-6 w-full h-1/4 ">
        <Column className=" min-w-[80px] h-20 items-center justify-center flex ">
          <h1 className="score-text">
            {happiness.value === -1 ? "--" : happiness.value}
          </h1>
        </Column>
        <div className="ml-6  h-full overflow-auto w-full">
          {happiness.comment === "" ? (
            <textarea
              placeholder="Write about your day"
              className=" p-5 bg-gray-50 focus:outline-none rounded-lg w-full h-[225px] resize-none"
              disabled
            />
          ) : (
            <p className=" h-50 overflow-auto  font-normal ">
              {happiness.comment}
            </p>
          )}
        </div>
      </Row>
      <div className="h-8" />
      {/* Comments */}
      <Column className=" flex-1 h-0 w-full items-stretch">
        <Comments commentsResult={commentsResult} />
      </Column>
    </Column>
  );
}
