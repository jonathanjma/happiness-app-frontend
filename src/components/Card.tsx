import React from "react";

// Simple card
export default function Card({
  children,
  className = "",
  ...rest
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={
        "flex flex-col rounded-2xl border border-[rgba(217,217,217,0.25)]" +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}
