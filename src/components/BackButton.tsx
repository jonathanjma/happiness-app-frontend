import { Link } from "react-router-dom";
import LeftArrowIcon from "../assets/arrow_left.svg";
import Row from "./layout/Row";

export default function BackButton({
  relativeUrl,
  text,
  className = "",
}: {
  relativeUrl: string;
  text: string;
  className?: string;
}) {
  return (
    <Row className={className}>
      <Link to={relativeUrl}>
        <Row className="items-center">
          <img src={LeftArrowIcon} className="max-w-[24px]" />
          <label className="font-normal text-gray-600">{text}</label>
        </Row>
      </Link>
    </Row>
  );
}
