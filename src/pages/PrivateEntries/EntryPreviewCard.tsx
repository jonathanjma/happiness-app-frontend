import UnlockedIcon from "../../assets/UnlockedIcon";
import Card from "../../components/Card";
import { Journal } from "../../data/models/Journal";
import { formatDate, parseYYYmmddFormat } from "../../utils";

export default function EntryPreviewCard({ click, selected, journal }: {
  click: () => void,
  selected: boolean,
  journal: Journal;
}) {
  const date = parseYYYmmddFormat(journal.timestamp);
  const isToday =
    formatDate(new Date()) === journal.timestamp;

  return (
    <div className="relative w-[108px]" onClick={click}>
      {isToday && (
        <p className={`absolute z-50 -translate-y-1/2 translate-x-1 transform rounded-3xl px-3 py-0.5 text-xs font-medium ${!selected ? "bg-yellow text-secondary" : "bg-secondary text-white"}`}>
          Today
        </p>
      )}
      <Card className={`p-3 w-[108px] h-[108px] elevation-01 overflow-hidden relative ${journal.data.length === 0 ? "bg-white" : "bg-light_yellow"} ${selected ? "bg-yellow" : ""}`}>
        <label className="text-gray-600 leading-4 z-10">{date.toLocaleString("en-us", { weekday: "long" })}</label>
        <p className="font-semibold text-gray-600 leading-5 z-10">{date.toLocaleDateString("en-us", { month: "short", day: "numeric" })}</p>
        <div className="absolute overflow-hidden translate-x-[36px] translate-y-[43px]">
          <UnlockedIcon width={60} height={78} opacity={0.08} />
        </div>
      </Card>
    </div>
  );
}
