import UnlockedIcon from "../../assets/UnlockedIcon";
import Card from "../../components/Card";
import { Journal } from "../../data/models/Journal";
import { formatDate, parseYYYYmmddFormat } from "../../utils";

export default function EntryPreviewCard({
  click,
  selected,
  journal,
}: {
  click: () => void;
  selected: boolean;
  journal: Journal;
}) {
  const date = parseYYYYmmddFormat(journal.timestamp);
  const isToday = formatDate(new Date()) === journal.timestamp;

  return (
    <div className="relative w-[108px]" onClick={click}>
      {isToday && (
        <p
          className={`absolute z-50 -translate-y-1/2 translate-x-1 transform rounded-3xl px-3 py-0.5 text-xs font-medium ${
            !selected ? "bg-yellow text-secondary" : "bg-secondary text-white"
          }`}
        >
          Today
        </p>
      )}
      <Card
        className={`elevation-01 relative h-[108px] w-[108px] overflow-hidden p-3 ${
          journal.data.length === 0 ? "bg-white" : "bg-light_yellow"
        } ${selected ? "bg-yellow" : ""}`}
      >
        <label className="z-10 leading-4 text-gray-600">
          {date.toLocaleString("en-us", { weekday: "long" })}
        </label>
        <p className="z-10 font-semibold leading-5 text-gray-600">
          {date.toLocaleDateString("en-us", { month: "short", day: "numeric" })}
        </p>
        <div className="absolute translate-x-[36px] translate-y-[43px] overflow-hidden">
          <UnlockedIcon width={60} height={78} opacity={0.08} />
        </div>
      </Card>
    </div>
  );
}
