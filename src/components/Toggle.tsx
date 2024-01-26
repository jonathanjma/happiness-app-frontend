/**
 *
 * @param toggled whether the toggle is toggled
 * @param onToggle what to do when the toggle is pressed
 * @returns
 */
export default function Toggle({
  toggled,
  onToggle,
}: {
  toggled: boolean;
  onToggle: (newToggleState: boolean) => void;
}) {
  const additionalStyles = toggled
    ? "bg-yellow shadow-form-selected "
    : " bg-gray-400 ";

  return (
    <div
      className={
        "relative h-6 w-[52px] rounded-3xl hover:cursor-pointer " +
        additionalStyles
      }
      onClick={() => {
        onToggle(toggled);
      }}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 top-0 my-auto h-[65%] w-[35%] select-none rounded-full bg-white duration-200 ease-in-out ${
          toggled ? "translate-x-[160%]" : "translate-x-1"
        }`}
      />
    </div>
  );
}
