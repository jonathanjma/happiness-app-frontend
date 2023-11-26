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
      className={"flex flex-row rounded-xl py-3 pl-3 pr-4.5 " + className}
      onClick={onClick}
      href={href}
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      <label className="font-semibold hover:cursor-pointer">{label}</label>
    </a>
  );
}
