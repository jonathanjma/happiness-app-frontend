import Row from "./layout/Row";
import ArrowUpIcon from "../assets/ArrowUpIcon";
import ArrowDownIcon from "../assets/ArrowDownIcon";
import RadioButton from "./RadioButton";

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
  const DateArrow = ({
    dates,
    setCurDates,
    change,
    radioValue,
  }: {
    dates: Date[];
    setCurDates: ((newValue: Date) => void)[];
    change: number;
    radioValue: number;
  }) => (
    <div
      className={
        "flex flex-col items-center justify-center hover:cursor-pointer" +
        " h-[40px] w-[40px] rounded-[10px] border-1 border-gray-100 p-[5px]"
      }
      onClick={() => {
        if (radioValue === 1) {
          setCurDates[0](
            new Date(
              dates[0].getFullYear(),
              dates[0].getMonth(),
              dates[0].getDate() + change * 7,
            ),
          );
          setCurDates[1](
            new Date(
              dates[1].getFullYear(),
              dates[1].getMonth(),
              dates[1].getDate() + change * 7,
            ),
          );
        } else {
          setCurDates[0](
            new Date(
              dates[0].getFullYear(),
              dates[0].getMonth() + change,
              dates[0].getDate(),
            ),
          );
          // weird: need to split into two cases so that month increments/decrements correctly
          setCurDates[1](
            change > 0
              ? new Date(
                  dates[1].getFullYear(),
                  dates[1].getMonth() + change + 1,
                  0,
                )
              : new Date(dates[1].getFullYear(), dates[1].getMonth(), 0),
          );
        }
      }}
    >
      {change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </div>
  );
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
            radioValue={radioValue}
          />
          <DateArrow
            dates={dates}
            setCurDates={setCurDates}
            change={-1}
            radioValue={radioValue}
          />
        </Row>
      </Row>
    </>
  );
}
