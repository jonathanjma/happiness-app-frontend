import UnlockedIcon from "../../assets/UnlockedIcon";
import Card from "../../components/Card";
import { Journal } from "../../data/models/Journal";

export default function EntryPreviewCard({ click, selected, data }: {
  click: () => void,
  selected: boolean,
  data: Journal;
}) {
  const date = new Date(data.timestamp);
  const isToday =
    date.toLocaleDateString("sv") === new Date().toLocaleDateString("sv");

  return (
    <div className="relative">
      {isToday && (
        <p className={`absolute -translate-y-1/2 translate-x-1 transform rounded-3xl px-3 py-0.5 text-xs font-medium ${!selected ? "bg-yellow text-secondary" : "bg-secondary text-white"}`}>
          Today
        </p>
      )}
      <Card className="p-3 w-[108px] h-[108px] elevation-01">
        <label className="text-gray-600 leading-4 z-10">{date.toLocaleString("en-us", { weekday: "long" })}</label>
        <p className="font-semibold text-gray-600 leading-5 z-10">{date.toLocaleDateString("en-us", { month: "short", day: "numeric" })}</p>
        <div className="absolute  translate-x-[40px] translate-y-[43px]">
          <UnlockedIcon width={60} height={78} />
        </div>
      </Card>
    </div>
  );
}
