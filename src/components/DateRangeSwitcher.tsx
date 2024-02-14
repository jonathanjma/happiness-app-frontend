import DateArrow from "./DateArrow";
import RadioButton from "./RadioButton";
import Row from "./layout/Row";

/**
 * Custom component switching start and end dates based on two separate ranges for a week or month.
 * By default, the left button selects dates from a 7-day interval, while the right button selects from a monthly interval.
 * @param radioValue a value representing whether left or right toggle is selected. 1 = left, 2 = right
 * @param setRadioValue function setting radioValue variable
 * @param dates two-element list of the mutable date variables representing beginning & end of range
 * @param setCurDates two-element list of the mutable setDate variables used in parent component
 * @param labels two-element list of the left and right button labels (default: ["Weekly", "Monthly"])
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
  labels?: string[];
  setCurDates: ((newValue: Date) => void)[];
}) {
  // change = 1 -> increment forward by one week/one month
  // change = -1 -> increment back by one week/one month

  return (
    <>
      <Row className="my-1 space-x-4">
        <RadioButton
          radioValue={radioValue}
          setRadioValue={setRadioValue}
          labels={labels}
        />
        <Row className="space-x-1">
          <DateArrow
            dates={dates}
            setCurDates={setCurDates}
            change={1}
            variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
          />
          <DateArrow
            dates={dates}
            setCurDates={setCurDates}
            change={-1}
            variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
          />
        </Row>
      </Row>
    </>
  );
}
