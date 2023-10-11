import { PropsWithChildren } from "react";

interface RowProps {
  className?: string;
}

export default function Row({
  children,
  className = "",
}: PropsWithChildren<RowProps>) {
  return <div className={"flex flex-row " + className}>{children}</div>;
}
