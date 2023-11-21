export default function Button({
  icon,
  label,
  onClick,
  variation = "FILLED",
  associatedModalId,
}: {
  icon?: React.ReactElement;
  label: string;
  onClick?: () => void;
  variation?: "OUTLINED" | "FILLED";
  associatedModalId?: string;
}) {
  const additions = icon ? "pl-3 pr-4.5" : "px-4.5";

  const className =
    variation === "FILLED"
      ? "flex flex-row self-start rounded-xl bg-[#F7EFD7] py-3 shadow-lg " +
        additions
      : "flex flex-row self-start rounded-xl py-3 border-secondary border-1 " +
        additions;

  console.log(`modal id: ${associatedModalId}`);
  return (
    <button
      data-hs-overlay={associatedModalId}
      type="button"
      className={className}
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
