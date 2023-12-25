import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Happiness } from "../data/models/Happiness";
import { formatDate } from "../utils";

export default function HappinessCalendar({ startDate, variation, selectedEntry, onSelectEntry }: {
  startDate: Date,
  variation: "MONTHLY" | "WEEKLY",
  selectedEntry: Happiness,
  onSelectEntry: () => void;
}) {
  const { api } = useApi();
  let endDate = new Date(startDate);
  if (variation === "MONTHLY") {
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);
  } else {
    endDate.setDate(endDate.getDate() + 6);
  }

  const { isLoading, data, isError } = useQuery<Happiness[]>(
    [QueryKeys.FETCH_HAPPINESS, `${formatDate(startDate)} to ${formatDate(endDate)}`],
    async () => {
      const res = await api
        .get<Happiness[]>("/happiness/", { start: formatDate(startDate), end: formatDate(endDate) });
      return res.data;
    });

  return <div className="grid gap-x-2 gap-y-4 w-full grid-cols-7">
    {isLoading ? <p>loading</p> : isError ? <p>error</p> : data!.map((happiness) =>
      <DayCell happinessPercent={happiness.value * 10} cellNumber={new Date(happiness.timestamp).getDate() + 1} />)}
  </div>;
}

const DayCell = ({ happinessPercent, cellNumber }: {
  happinessPercent: number,
  cellNumber: number;
}) => <div
  className="rounded-lg border-[1.5px] w-10 h-10 border-light_yellow p-1 flex flex-col items-center justify-center"
  style={{ background: `linear-gradient(to top, #F7EFD7 0%, #F7EFD7 ${happinessPercent}%, transparent ${happinessPercent}%, transparent 100%)` }}>
    <p className="text-xs text-gray-600 font-semibold">{cellNumber}</p>
  </div>;