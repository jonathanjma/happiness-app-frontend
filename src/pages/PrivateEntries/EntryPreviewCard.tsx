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
    <div className="relative w-[108px] ">
      {isToday && (
        <p className={`absolute -translate-y-1/2 translate-x-1 transform rounded-3xl px-3 py-0.5 text-xs font-medium ${!selected ? "bg-yellow text-secondary" : "bg-secondary text-white"}`}>
          Today
        </p>
      )}
      <Card className="p-3 w-[108px] h-[108px] elevation-01 overflow-hidden relative">
        <label className="text-gray-600 leading-4 z-10">{date.toLocaleString("en-us", { weekday: "long" })}</label>
        <p className="font-semibold text-gray-600 leading-5 z-10">{date.toLocaleDateString("en-us", { month: "short", day: "numeric" })}</p>
        <div className="absolute overflow-hidden translate-x-[36px] translate-y-[43px]">
          <UnlockedIcon width={60} height={78} opacity={0.08} />
        </div>
      </Card>
    </div>
  );
}
