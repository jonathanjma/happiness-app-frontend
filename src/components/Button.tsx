/**
 * Button component stylized for Happiness App
 * @param icon an icon to put at the start of the button
 * @param label the button text label
 * @param onClick the action on click
 * @param variation the style of the button, of type "OUTLINED" | "FILLED" | "TEXT" (see Figma style guide)
 * @param associatedModalId the id of any modals associated that need to be toggled when clicked
 * @returns
 */
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
  variation?: "OUTLINED" | "FILLED" | "TEXT";
  associatedModalId?: string;
}) {
  const additions = icon ? "pl-3 pr-4.5" : "px-4.5";

  let className =
    "flex flex-row items-center justify-center self-start rounded-lg min-w-[84px] py-3 ";

  switch (variation) {
    case "FILLED":
      className +=
        "bg-[#F7EFD7] hadow-lg border-1 border-solid border-[rgba(229,200,119,0.30)]  " +
        additions;
      break;
    case "OUTLINED":
      className += " border-secondary border-1 " + additions;
      break;
    case "TEXT":
      className += additions;
  }
  return (
    <button
      data-hs-overlay={`#${associatedModalId}`}
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
