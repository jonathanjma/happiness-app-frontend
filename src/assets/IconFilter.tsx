import { SVGProps } from "react";
interface FilterProps {
  filled?: boolean;
}

export default function IconFilter({
  filled = false,
  color,
  ...rest
}: SVGProps<SVGSVGElement> & FilterProps) {
  return filled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...rest}
    >
      <circle cx="20" cy="20" r="20" fill="#F7EFD7" />
      <path
        d="M18 26V24H22V26H18ZM14 21V19H26V21H14ZM11 16V14H29V16H11Z"
        fill="#664810"
      />
    </svg>
  ) : (
    <svg
      {...rest}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 18V16H14V18H10ZM6 13V11H18V13H6ZM3 8V6H21V8H3Z"
        fill={color}
      />
    </svg>
  );
}
