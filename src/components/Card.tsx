import React from "react";

// Simple card
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
        "flex flex-col border rounded-2xl border-[rgba(217,217,217,0.25)] " +
        className
      }
    >
      {children}
    </div>
  );
}
