import { NavLink } from "react-router-dom";

export default function LinkButton({
  icon,
  label,
  selectedClass,
  onClick,
  className,
  href,
}: {
  icon?: React.ReactElement;
  label: string;
  selectedClass: string[];
  onClick: () => void;
  className?: string;
  href: string;
}) {
  return (
    // <a
    //   type="button"
    //   className={"flex flex-row rounded-xl py-3 pl-3 pr-4.5 " + className}
    //   onClick={onClick}
    //   href={href}
    // >
    // </a>
    <NavLink
      to={href}
      className={({ isActive }) =>
        "flex w-full flex-row rounded-xl py-3 pl-3 pr-4.5 font-medium text-dark_gray " +
        className +
        (isActive ? selectedClass[0] : selectedClass[1])
      }
      onClick={onClick}
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      {label}
    </NavLink>
  );
}
