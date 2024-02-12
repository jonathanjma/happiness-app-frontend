import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { Happiness } from "../data/models/Happiness";
import { dateFromStr, formatDate, getWeekdayFromNumber } from "../utils";
import Spinner from "./Spinner";
import Row from "./layout/Row";

export default function HappinessCalendar({
  startDate,
  variation,
  selectedEntry,
  onSelectEntry,
  userId,
}: {
  startDate: Date;
  variation: "MONTHLY" | "WEEKLY";
  selectedEntry: Happiness | undefined;
  onSelectEntry: (selectedEntry: Happiness) => void;
  userId?: number;
}) {
  const { api } = useApi();
  const { user } = useUser();
  let endDate = new Date(startDate);
  const days = [];
  // Check the variation to format the query to send to the backend
  // as well as the list of days that will be shown on the calendar.
  if (variation === "MONTHLY") {
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);

    const startDaysOfWeek = new Date(startDate);
    const dayToAdd = new Date(startDate);
    while (startDaysOfWeek.getDay() !== 0) {
      startDaysOfWeek.setDate(startDaysOfWeek.getDate() - 1);
      days.unshift(new Date(startDaysOfWeek));
    }
    while (dayToAdd.getMonth() === endDate.getMonth()) {
      days.push(new Date(dayToAdd));
      dayToAdd.setDate(dayToAdd.getDate() + 1);
    }
  } else {
    endDate.setDate(endDate.getDate() + 6);

    const dayToAdd = new Date(startDate);
    for (let i = 0; i <= 6; i++) {
      days.push(new Date(dayToAdd));
      dayToAdd.setDate(dayToAdd.getDate() + 1);
    }
  }

  // Since monthly extends beyond the month to fill in the week, we add 1 week
  // of padding to the query
  let finalStartDate = new Date(startDate);
  let finalEndDate = new Date(endDate);

  if (variation === "MONTHLY") {
    finalStartDate.setDate(finalStartDate.getDate() - 7);
    finalEndDate.setDate(finalEndDate.getDate() + 7);
  }

  const { isLoading, data, isError } = useQuery<Happiness[]>(
    [
      QueryKeys.FETCH_HAPPINESS,
      `${formatDate(startDate)} to ${formatDate(endDate)}`,
    ],
    async () => {
      const res = await api.get<Happiness[]>("/happiness/", {
        start: formatDate(finalStartDate),
        end: formatDate(finalEndDate),
        id: userId ?? user!.id,
      });
      return res.data;
    },
  );

  return (
    <div
      className={`grid w-full gap-y-4 ${
        variation === "MONTHLY" ? "grid-cols-7" : "grid-cols-1"
      } `}
    >
      {variation === "MONTHLY" &&
        Array(7)
          .fill(0)
          .map((_, i) => (
            <Row key={i} className="w-full justify-center">
              <label className="text-xs text-gray-400">
                {getWeekdayFromNumber(i)}
              </label>
            </Row>
          ))}

      {isLoading ? (
        <Spinner className="ml-8" />
      ) : isError ? (
        <p className="text-gray-400">Error: Could not load entries.</p>
      ) : (
        days.map((date, i) => {
          const matchingHappiness = data?.find(
            (h) => h.timestamp === formatDate(date),
          );
          if (matchingHappiness) {
            return (
              <Row key={i} className="w-full justify-center">
                <DayCell
                  happiness={matchingHappiness}
                  isSelected={
                    selectedEntry !== undefined &&
                    selectedEntry &&
                    formatDate(date) === selectedEntry.timestamp
                  }
                  onClick={() => {
                    onSelectEntry(matchingHappiness);
                  }}
                  key={matchingHappiness.id}
                  showWeekday={variation === "WEEKLY"}
                />
              </Row>
            );
          }
          return (
            <Row key={i} className="w-full justify-center">
              <EmptyCell
                showWeekday={variation === "WEEKLY"}
                key={date.getDate() + date.getMonth() * 1000}
                happinessDate={date}
              />
            </Row>
          );
        })
      )}
    </div>
  );
}

const DayCell = ({
  happiness,
  isSelected,
  onClick,
  showWeekday = false,
}: {
  happiness: Happiness;
  isSelected: boolean;
  onClick: () => void;
  showWeekday?: boolean;
}) => {
  const happinessPercent = happiness.value * 10;
  const cellNumber = dateFromStr(happiness.timestamp).getDate();
  const isToday = formatDate(new Date()) === happiness.timestamp;
  const fillColor = isSelected ? "#F0CF78" : "#F7EFD7";
  console.log(`happiness timestamp: ${happiness.timestamp}`);
  console.log(`parsed date: ${dateFromStr(happiness.timestamp)}`);

  return (
    <div
      className={`h-10 w-10 rounded-lg border-[1.5px] ${
        isSelected || isToday ? "border-yellow" : "border-light_yellow"
      }  flex flex-col items-center justify-center`}
      style={{
        background: `linear-gradient(to top, ${fillColor} 0%, ${fillColor} ${happinessPercent}%, transparent ${happinessPercent}%, transparent 100%)`,
      }}
      onClick={onClick}
    >
      <div className="relative h-full w-full">
        <div className="flex h-full w-full items-center justify-center">
          <p
            className={`text-xs ${
              isToday ? "text-secondary" : "text-gray-600"
            } font-semibold`}
          >
            {showWeekday
              ? dateFromStr(happiness.timestamp).toLocaleDateString("en-us", {
                  weekday: "short",
                })
              : cellNumber}
          </p>
        </div>

        {isToday && (
          <div className="absolute bottom-0 left-0 right-0 mx-auto h-[3px] w-4 rounded-[18px] bg-yellow" />
        )}
      </div>
    </div>
  );
};

const EmptyCell = ({
  happinessDate,
  showWeekday = false,
}: {
  happinessDate: Date;
  showWeekday?: boolean;
}) => {
  const isToday = formatDate(happinessDate) === formatDate(new Date());

  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center border-[1px] ${
        isToday ? "border-yellow" : "border-gray-300"
      } rounded-lg`}
    >
      <p
        className={`text-xs ${
          isToday ? "text-secondary" : "text-gray-600"
        } font-semibold`}
      >
        {showWeekday
          ? happinessDate.toLocaleDateString("en-us", { weekday: "short" })
          : happinessDate.getDate()}
      </p>
      {isToday && (
        <div className="absolute left-1/2 h-[3px] w-4 -translate-x-1/2 translate-y-[18px] transform rounded-[18px] bg-yellow" />
      )}
    </div>
  );
};
