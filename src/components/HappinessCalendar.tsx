import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Happiness } from "../data/models/Happiness";
import { formatDate, getWeekdayFromNumber, parseYYYmmddFormat } from "../utils";
import Row from "./layout/Row";

export default function HappinessCalendar({ startDate, variation, selectedEntry, onSelectEntry }: {
  startDate: Date,
  variation: "MONTHLY" | "WEEKLY",
  selectedEntry: Happiness,
  onSelectEntry: (selectedEntry: Happiness) => void;
}) {
  const { api } = useApi();
  let endDate = new Date(startDate);
  const days = [];
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
      dayToAdd.setDate(dayToAdd.getDate() + i);
      days.push(new Date(dayToAdd));
    }
  }

  const { isLoading, data, isError } = useQuery<Happiness[]>(
    [QueryKeys.FETCH_HAPPINESS, `${formatDate(startDate)} to ${formatDate(endDate)}`],
    async () => {
      const res = await api
        .get<Happiness[]>("/happiness/", { start: formatDate(startDate), end: formatDate(endDate) });
      return res.data;
    });

  return <div className="grid gap-x-2 gap-y-4 w-full grid-cols-7">

    {Array(7).fill(0).map((_, i) => <Row className="w-full justify-center"> <label className="text-xs text-gray-400">{getWeekdayFromNumber(i)}</label></Row>)}

    {isLoading ? <p>loading</p> : isError ? <p>error</p> :
      days.map((date) => {
        const matchingDateList = data?.filter((h) => h.timestamp === formatDate(date));
        if (matchingDateList && matchingDateList.length > 0) {
          return <DayCell
            happiness={matchingDateList[0]}
            isSelected={selectedEntry && formatDate(date) === selectedEntry.timestamp}
            onClick={() => { onSelectEntry(matchingDateList[0]); }}
            key={matchingDateList[0].id}
          />;
        }
        return <EmptyCell key={date.getDate() + date.getMonth() * 1000} cellNumber={date.getDate()} />;
      })
    }
  </div>;
}

const DayCell = ({ happiness, isSelected, onClick }: { happiness: Happiness; isSelected: boolean; onClick: () => void; }) => {
  const happinessPercent = happiness.value * 10;
  const cellNumber = parseYYYmmddFormat(happiness.timestamp).getDate();
  const isToday = formatDate(new Date()) === happiness.timestamp;
  const fillColor = isSelected ? "#F0CF78" : "#F7EFD7";

  return (
    <div
      className={`rounded-lg border-[1.5px] w-10 h-10 ${isSelected || isToday ? 'border-yellow' : 'border-light_yellow'}  p-1 flex flex-col items-center justify-center`}
      style={{ background: `linear-gradient(to top, ${fillColor} 0%, ${fillColor} ${happinessPercent}%, transparent ${happinessPercent}%, transparent 100%)` }}
      onClick={onClick}
    >
      <p className={`text-xs ${isToday ? "text-secondary" : "text-gray-600"} font-semibold`}>{cellNumber}</p>
      {isToday && <div
        className="absolute left-1/2 transform translate-y-full rounded-[18px] bg-yellow -translate-x-1/2 w-16 h-3"
      ></div>}

    </div>
  );
};

const EmptyCell = ({ cellNumber }: { cellNumber: number; }) => {
  const isToday = cellNumber === new Date().getDate();

  return <div className={`w-10 h-10 flex items-center justify-center border-[1px] relative ${isToday ? 'border-yellow' : 'border-gray-300'} rounded-lg`}>
    <p className={`text-xs ${isToday ? "text-secondary" : "text-gray-600"} font-semibold`}>{cellNumber}</p>
    {isToday && <div
      className="absolute left-1/2 transform translate-y-[18px] rounded-[18px] bg-yellow -translate-x-1/2 w-4 h-[3px]"
    ></div>}
  </div>;
};
