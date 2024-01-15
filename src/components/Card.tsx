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
        "flex flex-col rounded-2xl border border-none shadow-md2 " + className
      }
      {...rest}
    >
      {children}
    </div>
  );
}
