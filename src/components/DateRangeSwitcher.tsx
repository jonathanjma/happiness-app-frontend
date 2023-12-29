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
            "select-none text-base " +
            (radioValue === 1 ? "font-semibold" : "font-medium")
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
            "select-none text-base " +
            (radioValue === 2 ? "font-semibold" : "font-medium")
          }
        >
          {labels[1]}
        </label>
      </button>
    </Row>
  );

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
        <WeekMonthSwitcher
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

const ArrowUpIcon = () => (
  <svg
    width="18"
    height="11"
    viewBox="0 0 18 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1909_7051)">
      <path
        d="M9.79222 4.39779C9.3547 3.96024 8.6453 3.96024 8.20778 4.39779L2.39803 10.2077C1.9605 10.6453 1.25111 10.6453 0.813586 10.2077L0.792165 10.1863C0.35466 9.7488 0.35466 9.03946 0.792165 8.60194L8.20778 1.18605C8.6453 0.748507 9.3547 0.748507 9.79222 1.18605L17.2078 8.60194C17.6453 9.03946 17.6453 9.7488 17.2078 10.1863L17.1864 10.2077C16.7489 10.6453 16.0395 10.6453 15.602 10.2077L9.79222 4.39779Z"
        fill="#575F68"
      />
    </g>
    <defs>
      <clipPath id="clip0_1909_7051">
        <rect
          width="10.6062"
          height="18"
          fill="white"
          transform="matrix(0 -1 1 0 0 11)"
        />
      </clipPath>
    </defs>
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    width="18"
    height="11"
    viewBox="0 0 18 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1909_7054)">
      <path
        d="M8.20778 6.60221C8.6453 7.03976 9.3547 7.03976 9.79222 6.60221L15.602 0.792253C16.0395 0.354709 16.7489 0.354708 17.1864 0.792253L17.2078 0.813674C17.6453 1.2512 17.6453 1.96054 17.2078 2.39806L9.79222 9.81395C9.3547 10.2515 8.6453 10.2515 8.20778 9.81395L0.792166 2.39806C0.35466 1.96054 0.354658 1.2512 0.792164 0.813674L0.813585 0.792253C1.25111 0.354708 1.9605 0.354708 2.39803 0.792253L8.20778 6.60221Z"
        fill="#575F68"
      />
    </g>
    <defs>
      <clipPath id="clip0_1909_7054">
        <rect
          width="10.6062"
          height="18"
          fill="white"
          transform="matrix(0 1 -1 0 18 0)"
        />
      </clipPath>
    </defs>
  </svg>
);
