import ArrowDownIcon from "../assets/ArrowDownIcon";
import ArrowUpIcon from "../assets/ArrowUpIcon";

export default function DateArrow({
  change,
  variation,
  setCurDates,
  dates,
}: {
  change: number;
  variation: "WEEKLY" | "MONTHLY";
  setCurDates: ((newValue: Date) => void)[];
  dates: Date[];
}) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center hover:cursor-pointer" +
        " h-[40px] w-[40px] rounded-[10px] border-1 border-gray-100 p-[5px]"
      }
      onClick={() => {
        if (variation === "WEEKLY") {
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
}
