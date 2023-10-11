import React from "react";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactElement;
}) {
  return (
    <div
      className={
        "flex flex-col bg-white border rounded-2xl border-light_gray " +
        className
      }
    >
      {children}
    </div>
  );
}
