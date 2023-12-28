import CloseIcon from "../../assets/CloseIcon";
import { Happiness } from "../../data/models/Happiness";
import Comments from "../Comments";
import Column from "../layout/Column";
import Row from "../layout/Row";
import Modal from "./Modal";

export default function HappinessViewerModal({
  happiness,
  id,
}: {
  happiness: Happiness;
  id: string;
}) {
  return (
    <Modal id={id}>
      <Column className="w-[600px] gap-6">
        {/* Top row for closing */}
        <Row>
          <div className="flex flex-1" />
          <button data-hs-overlay={`#${id}`}>
            <CloseIcon color="#575F68" />
          </button>
        </Row>

        {/* Profile and score row */}
        <Row className="items-center">
          {/* Profile picture */}
          <img
            className="h-[42px] w-[42px] rounded-full"
            src={happiness.author.profile_picture}
          />
          <div className="w-2" />
          {/* Name and time */}
          <Column>
            <p className="font-medium leading-6 text-gray-600">
              {happiness.author.username}
            </p>
            <label className="leading-4 text-gray-400 ">
              {new Date(happiness.timestamp).toLocaleDateString("en-us", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
            </label>
          </Column>
          <div className="flex flex-1" />
          {/* Score */}
          <h3 className="text-gray-600">{happiness.value.toFixed(1)}</h3>
        </Row>

        {/* Entry text */}
        <p className="text-gray-600">{happiness.comment}</p>

        {/* Comments */}
        <div>
          <Comments
            modalVariant
            associatedHappinessId={happiness.id}
            canAddComment={true}
          />
        </div>
      </Column>
    </Modal>
  );
}
