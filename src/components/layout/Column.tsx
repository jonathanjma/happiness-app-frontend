export default function Column({
  children,
  className = "",
  ...rest
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={"flex flex-col " + className} {...rest}>
      {children}
    </div>
  );
}
