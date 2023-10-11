export default function Button({
  icon = <></>,
  label,
}: {
  icon?: React.ReactElement;
  label: string;
}) {
  return (
    <button
      type="button"
      className="self-start py-3 pl-3 pr-4.5 bg-[#F7EFD7] flex flex-row rounded-xl shadow-lg"
    >
      {icon && (
        <>
          {icon}
          <div className="w-2.5" />
        </>
      )}
      <label className=" text-secondary font-semibold">{label}</label>
    </button>
  );
}
