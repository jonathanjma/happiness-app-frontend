export default function Button({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactElement;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="flex flex-row self-start rounded-xl bg-[#F7EFD7] py-3 pl-3 pr-4.5 shadow-lg"
      onClick={onClick}
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      <label className=" font-semibold text-secondary hover:cursor-pointer">
        {label}
      </label>
    </button>
  );
}
