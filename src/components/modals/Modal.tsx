// This allows a compile error when an id isn't provided.
// This is good since an id is required for the modal to function.
interface RequiredModalProps {
  id: string;
  children: React.ReactNode;
}

/**
 * Generalized modal component. Integrates with preline. You must pass in an id
 * for the modal to function properly.
 * @see EntriesCard.tsx for an example of use.
 * @param className style additions to the modal
 * @returns
 */
export default function Modal({
  children,
  className,
  ...rest
}: React.HTMLProps<HTMLDivElement> & RequiredModalProps) {
  return (
    <div
      {...rest}
      className={
        "hs-overlay fixed start-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden bg-[rgba(0,0,0,0.5)] transition-all " +
        className
      }
    >
      <div className=" mx-auto mt-16 w-fit rounded-3xl bg-white p-8 opacity-0 transition-all hs-overlay-open:opacity-100 hs-overlay-open:duration-500 ">
        {children}
      </div>
    </div>
  );
}
