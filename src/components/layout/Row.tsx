export default function Row({
  children,
  className = "",
  ...rest
}: React.HTMLProps<HTMLDivElement>) {
  return <div className={"flex flex-row " + className} {...rest}>{children}</div>;
}
