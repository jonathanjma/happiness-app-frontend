import { Link } from "react-router-dom";
import LeftArrowIcon from "../assets/arrow_left.svg";
import Row from "./layout/Row";

export default function BackButton({
  relativeUrl,
  text,
  className = "",
  state,
}: {
  relativeUrl: string;
  text: string;
  className?: string;
  state?: any;
}) {
  return (
    <Row className={className}>
      <Link to={relativeUrl} state={state}>
        <Row className="items-center">
          <img src={LeftArrowIcon} className="max-w-[24px]" />
          <label className="font-normal text-gray-600">{text}</label>
        </Row>
      </Link>
    </Row>
  );
}
