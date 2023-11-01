import React, { PropsWithChildren } from "react";

interface ColumnProps {
  className?: string;
}

export default function Column({
  className = "",
  children,
}: PropsWithChildren<ColumnProps>) {
  return <div className={"flex flex-col " + className}>{children}</div>;
}
