import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Happiness } from "../data/models/Happiness";
import { formatDate, getWeekdayFromNumber, parseYYYmmddFormat } from "../utils";
import Row from "./layout/Row";

export default function HappinessCalendar({ startDate, variation, selectedEntry = undefined, onSelectEntry = () => { }, openModalId = "" }: {
  startDate: Date,
  variation: "MONTHLY" | "WEEKLY",
  selectedEntry?: Happiness | undefined,
  onSelectEntry?: (selectedEntry: Happiness) => void;
  openModalId?: string;
}) {
  const { api } = useApi();
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
      dayToAdd.setDate(startDate.getDate() + i);
      days.push(new Date(dayToAdd));
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
    [QueryKeys.FETCH_HAPPINESS, `${formatDate(startDate)} to ${formatDate(endDate)}`],
    async () => {
      const res = await api
        .get<Happiness[]>("/happiness/", { start: formatDate(finalStartDate), end: formatDate(finalEndDate) });
      return res.data;
    });

  return <div className={`grid gap-y-4 w-full ${variation === "MONTHLY" ? 'grid-cols-7' : "grid-cols-1"} `}>
    {variation === "MONTHLY" && Array(7).fill(0).map((_, i) =>
      <Row className="w-full justify-center">
        <label className="text-xs text-gray-400">{getWeekdayFromNumber(i)}</label>
      </Row>
    )}

    {isLoading ? <p>loading</p> : isError ? <p>error</p> :
      days.map((date) => {
        const matchingHappiness = data?.find((h) => h.timestamp === formatDate(date));
        if (matchingHappiness) {
          return <Row className="w-full justify-center">
            <DayCell
              happiness={matchingHappiness}
              isSelected={selectedEntry !== undefined && formatDate(date) === selectedEntry.timestamp}
              onClick={() => { onSelectEntry(matchingHappiness); }}
              key={matchingHappiness.id}
              showWeekday={variation === "WEEKLY"}
              openModalId={openModalId}
            />
          </Row>;
        }
        return <Row className="w-full justify-center">
          <EmptyCell showWeekday={variation === "WEEKLY"} key={date.getDate() + date.getMonth() * 1000} happinessDate={date} />
        </Row>;
      })
    }
  </div>;
}

const DayCell = ({ happiness, isSelected, onClick, showWeekday = false, openModalId }: {
  happiness: Happiness;
  isSelected: boolean;
  onClick: () => void;
  showWeekday?: boolean;
  openModalId: string;
}) => {
  const happinessPercent = happiness.value * 10;
  const cellNumber = parseYYYmmddFormat(happiness.timestamp).getDate();
  const isToday = formatDate(new Date()) === happiness.timestamp;
  const fillColor = isSelected ? "#F0CF78" : "#F7EFD7";

  return (
    <button onClick={onClick} data-hs-overlay={`#${openModalId}`} className="hover:cursor-pointer">
      <div
        className={`rounded-lg border-[1.5px] w-10 h-10 ${isSelected || isToday ? 'border-yellow' : 'border-light_yellow'}  p-1 flex flex-col items-center justify-center`}
        style={{ background: `linear-gradient(to top, ${fillColor} 0%, ${fillColor} ${happinessPercent}%, transparent ${happinessPercent}%, transparent 100%)` }}
        onClick={onClick}
      >
        <p className={`text-xs ${isToday ? "text-secondary" : "text-gray-600"} font-semibold`}>
          {showWeekday ?
            parseYYYmmddFormat(happiness.timestamp).toLocaleDateString("en-us", { weekday: "short" })
            : cellNumber}
        </p>
        {isToday &&
          <div
            className="absolute left-1/2 transform translate-y-full rounded-[18px] bg-yellow -translate-x-1/2 w-16 h-3"
          />
        }
      </div>
    </button>
  );
};

const EmptyCell = ({ happinessDate, showWeekday = false }: { happinessDate: Date; showWeekday?: boolean; }) => {
  const isToday = formatDate(happinessDate) === formatDate(new Date());

  return <div className={`w-10 h-10 flex items-center justify-center border-[1px] relative ${isToday ? 'border-yellow' : 'border-gray-300'} rounded-lg`}>
    <p className={`text-xs ${isToday ? "text-secondary" : "text-gray-600"} font-semibold`}>{showWeekday ?
      happinessDate.toLocaleDateString("en-us", { weekday: "short" })
      : happinessDate.getDate()}</p>
    {isToday &&
      <div
        className="absolute left-1/2 transform translate-y-[18px] rounded-[18px] bg-yellow -translate-x-1/2 w-4 h-[3px]"
      />
    }
  </div>;
};
