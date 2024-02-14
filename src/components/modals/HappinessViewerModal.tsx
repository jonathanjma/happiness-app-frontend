import CloseIcon from "../../assets/CloseIcon";
import { Happiness } from "../../data/models/Happiness";
import Comments from "../Comments";
import Column from "../layout/Column";
import Row from "../layout/Row";
import Modal from "./Modal";
import { dateFromStr } from "../../utils";
import { dateOrTodayYesterday } from "../../pages/Group/GroupFeed";
import LeftArrowIcon from "../../assets/arrow_left.svg";

export default function HappinessViewerModal({
  happiness,
  id,
  onBackButtonPress,
}: {
  happiness: Happiness;
  id: string;
  onBackButtonPress?: () => void;
}) {
  return (
    <Modal id={id}>
      <Column className="w-[600px] gap-6">
        {/* Top row for closing */}
        <Row>
          {onBackButtonPress ? (
            <>
              <button onClick={onBackButtonPress}>
                <Row>
                  <img src={LeftArrowIcon} className="h-full" />
                  <div className="ml-2 font-normal text-gray-600">Back</div>
                </Row>
              </button>
              <div className="flex flex-1" />
            </>
          ) : (
            <>
              <div className="flex flex-1" />
              <button data-hs-overlay={`#${id}`}>
                <CloseIcon color="#575F68" />
              </button>
            </>
          )}
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
              {dateOrTodayYesterday(
                happiness.timestamp,
                dateFromStr(happiness.timestamp).toLocaleString("en-us", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
              )}
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
