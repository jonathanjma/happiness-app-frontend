import { createRef, useEffect, useState } from "react";
import EditIcon from "../../assets/EditIcon";
import Button from "../../components/Button";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import CommentCard from "./CommentCard";

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
  const commentsContainer = createRef<HTMLDivElement>();
  const [dividerOpacity, setDividerOpacity] = useState(100);

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
            {new Date().toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h5>
        </Column>
        <div className="flex-1" />
        <Button label="Edit Entry" icon={<EditIcon />} />
      </Row>
      {/* Entry and score */}
      <Row className="mt-6 w-full h-1/4 ">
        <Column className="w-20 h-20 items-center justify-center flex ">
          <h1 className="score-text">{7.5}</h1>
        </Column>
        <div className="ml-6  h-full overflow-auto">
          <p className=" h-50 overflow-auto">
            {
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet."
            }
          </p>
        </div>
      </Row>
      <div className="h-8" />
      {/* Comments */}
      <Column className=" flex-1 h-0 w-full items-stretch">
        <h5 className=" my-0.25 ">Comments (4)</h5>
        <div
          className={
            "h-0.25 w-full bg-gray-200 duration-500 transition-opacity opacity-" +
            dividerOpacity
          }
        />
        <div className="overflow-auto" ref={commentsContainer}>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <CommentCard
                comment={{
                  id: 1,
                  happinessId: 2,
                  author: {
                    id: 1,
                    username: "Test",
                    profilePicture:
                      "https://daily.jstor.org/wp-content/uploads/2015/05/standardizedtests.jpg",
                  },
                  text: "This is such a good story haha! Every single bit about it was exactly what I had expected, and I don’t want it to change!",
                  timestamp: new Date()
                    .setHours(new Date().getHours() - 2)
                    .toString(),
                }}
              />
            ))}
        </div>
      </Column>
    </Column>
  );
}
