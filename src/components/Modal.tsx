export default function Modal({
  children,
  className,
  ...rest
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className="hs-overlay fixed start-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden bg-[rgba(0,0,0,0.5)] transition-all"
    >
      <div className=" mx-auto mt-16 w-fit rounded-3xl bg-white p-8 opacity-0 transition-all hs-overlay-open:opacity-100 hs-overlay-open:duration-500 ">
        {children}
      </div>
    </div>
  );
}
