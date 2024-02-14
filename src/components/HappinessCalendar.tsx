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
  groupId = undefined, // undefined if for individual user and not for group
}: {
  startDate: Date;
  variation: "MONTHLY" | "WEEKLY";
  selectedEntry: Happiness[] | undefined;
  onSelectEntry: (selectedEntry: Happiness[]) => void;
  userId?: number;
  groupId?: undefined | number;
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

  const { isLoading, data, isError } =
    groupId !== undefined
      ? useQuery<Happiness[]>(
          [
            QueryKeys.FETCH_GROUP_HAPPINESS,
            `${formatDate(startDate)} to ${formatDate(endDate)}`,
          ],
          async () => {
            const res = await api.get<Happiness[]>(
              `/group/${groupId}/happiness`,
              {
                start: formatDate(finalStartDate),
                end: formatDate(finalEndDate),
              },
            );
            return res.data;
          },
        )
      : useQuery<Happiness[]>(
          [
            QueryKeys.FETCH_HAPPINESS,
            `${formatDate(startDate)} to ${formatDate(endDate)}`,
          ],
          async () => {
            const query: Record<string, any> = {
              start: formatDate(finalStartDate),
              end: formatDate(finalEndDate),
            };
            if (userId) query.id = userId;
            const res = await api.get<Happiness[]>("/happiness/", query);
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
          const matchingHappiness = data?.filter(
            (h) => h.timestamp === formatDate(date),
          );
          // checks if matchingHappiness array exists and the first entry exists
          if (matchingHappiness && matchingHappiness[0]) {
            return (
              <Row key={i} className="w-full justify-center">
                <DayCell
                  happinessValue={
                    matchingHappiness
                      .map((happiness) => happiness.value)
                      .reduce((a, b) => a + b, 0) / matchingHappiness.length
                  }
                  happinessDate={dateFromStr(matchingHappiness[0].timestamp)}
                  isSelected={
                    selectedEntry !== undefined &&
                    selectedEntry &&
                    formatDate(date) === selectedEntry[0].timestamp
                  }
                  onClick={() => {
                    onSelectEntry(matchingHappiness);
                  }}
                  key={matchingHappiness[0].id}
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
  happinessValue,
  happinessDate,
  isSelected,
  onClick,
  showWeekday = false,
}: {
  happinessValue: number;
  happinessDate: Date;
  isSelected: boolean;
  onClick: () => void;
  showWeekday?: boolean;
}) => {
  const happinessPercent = happinessValue * 10;
  const cellNumber = happinessDate.getDate();
  const isToday = formatDate(new Date()) === formatDate(happinessDate);
  const fillColor = isSelected ? "#F0CF78" : "#F7EFD7";
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
              ? happinessDate.toLocaleDateString("en-us", { weekday: "short" })
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
