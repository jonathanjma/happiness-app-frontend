import { Link } from "react-router-dom";
import Row from "./layout/Row";
import LeftArrowIcon from "../assets/arrow_left.svg";
import React from "react";

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
        <Row>
          <img src={LeftArrowIcon} className="max-w-[24px]" />
          <label className="font-normal text-gray-600">{text}</label>
        </Row>
      </Link>
    </Row>
  );
}
