import React from "react";

type CardProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={
        "flex flex-col rounded-2xl border border-[rgba(217,217,217,0.25)] " +
        props.className
      }
    >
      {children}
    </div>
  );
}
