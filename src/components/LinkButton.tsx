export default function LinkButton({
  icon,
  label,
  onClick,
  className,
  href,
}: {
  icon?: React.ReactElement;
  label: string;
  onClick: () => void;
  className?: string;
  href: string;
}) {
  return (
    <a
      type="button"
      className={
        "self-start py-3 pl-3 pr-4.5 bg-[#F7EFD7] flex flex-row rounded-xl " +
        className
      }
      onClick={onClick}
      href={href}
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      {/* TODO label is not clickable */}
      <label className="text-secondary font-semibold">{label}</label>
    </a>
  );
}
