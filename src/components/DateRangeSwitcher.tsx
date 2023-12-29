import Row from "./layout/Row";

/**
 * Custom component switching start and end dates based on two separate ranges for a week or month.
 * By default, the left button selects dates from a 7-day interval, while the right button selects from a monthly interval.
 * @param radioValue a value representing whether left or right toggle is selected. 1 = left, 2 = right
 * @param setRadioValue function setting radioValue variable
 * @param dates two-element list of the mutable date variables representing beginning & end of range
 * @param setCurDates two-element list of the mutable setDate variables used in parent component
 * @param labels two-element list of the left and right button labels (default: ["Weekly", "Monthly"])
 * @param intervalLengths two-element list representing the interval (default: []) (NOT IMPLEMENTED)
 * @returns
 */

export default function DateRangeSwitcher({
  radioValue,
  setRadioValue,
  dates,
  setCurDates,
  labels = ["Weekly", "Monthly"],
}: {
  radioValue: number;
  setRadioValue: (newValue: number) => void;
  dates: Date[];
  labels?: String[];
  setCurDates: ((newValue: Date) => void)[];
}) {
  const WeekMonthSwitcher = ({
    radioValue,
    setRadioValue,
    labels,
  }: {
    radioValue: number;
    setRadioValue: (newValue: number) => void;
    labels: String[];
  }) => (
    <Row className="w-[200px]">
      <button
        className={
          "w-1/2 rounded-l-lg border border-1.5 p-1 " +
          (radioValue === 1
            ? "border-yellow bg-yellow text-secondary"
            : "border-r-0.5 border-gray-100 bg-white text-dark_gray")
        }
        onClick={() => {
          setRadioValue(1);
        }}
      >
        <label
          className={
            "text-base " + (radioValue === 1 ? "font-semibold" : "font-medium")
          }
        >
          {labels[0]}
        </label>
      </button>
      <button
        className={
          "border-right w-1/2 rounded-r-lg border-1.5 p-1 " +
          (radioValue === 2
            ? "border-yellow bg-yellow text-secondary"
            : "border-l-0.5 border-gray-100 bg-white text-dark_gray")
        }
        onClick={() => {
          setRadioValue(2);
        }}
      >
        <label
          className={
            "text-base " + (radioValue === 2 ? "font-semibold" : "font-medium")
          }
        >
          {labels[1]}
        </label>
      </button>
    </Row>
  );
  return (
    <>
      <WeekMonthSwitcher
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        labels={labels}
      />
    </>
  );
}
