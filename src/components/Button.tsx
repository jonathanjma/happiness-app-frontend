export interface ButtonProps {
  icon?: React.ReactElement;
  label?: string;
  onClick?: () => void;
  variation?:
    | "OUTLINED"
    | "FILLED"
    | "TEXT"
    | "DANGEROUS"
    | "GRAY"
    | "SUPER_DANGEROUS";
  size?: "SMALL" | "LARGE";
  associatedModalId?: string;
  classNameBtn?: string;
  classNameText?: string;
}

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
  label = "",
  onClick,
  variation = "FILLED",
  size = "LARGE",
  associatedModalId,
  classNameBtn = "",
  classNameText = "",
}: ButtonProps) {
  let className =
    "flex flex-row items-center justify-center self-start rounded-lg min-w-[84px] py-3 text-secondary ";

  className += icon ? "pl-3 pr-4.5 " : "px-4.5 ";
  className += size === "LARGE" ? "h-12 " : "h-10 ";

  let textColor = "text-secondary";

  switch (variation) {
    case "FILLED":
      className +=
        "bg-light_yellow shadow-md1 border-1 border-solid border-[rgba(229,200,119,0.30)]  ";
      break;
    case "OUTLINED":
      className += "border-secondary border-1 ";
      break;
    case "TEXT":
      break;
    case "DANGEROUS":
      className += "bg-gray-50 text-error shadow-md1 text-error ";
      textColor = "text-error";
      break;
    case "SUPER_DANGEROUS":
      className += "bg-error shadow-md1";
      textColor = "text-white";
      break;
    case "GRAY":
      className += "bg-gray-50 shadow-md1";
      textColor = "text-gray-600";
      break;
  }

  return (
    <button
      data-hs-overlay={`#${associatedModalId}`}
      type="button"
      className={className + classNameBtn}
      onClick={onClick}
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      <label
        className={` font-semibold hover:cursor-pointer ${classNameText} ${textColor}`}
      >
        {label}
      </label>
    </button>
  );
}
