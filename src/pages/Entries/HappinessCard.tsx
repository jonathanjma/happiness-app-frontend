import Card from "../../components/Card";
import { Happiness } from "../../data/models/Happiness";

// Shows the data and score of a happiness entry in the scrollable calendar
export default function HappinessCard({
  data,
  selected,
  click,
}: {
  data: Happiness;
  selected: boolean;
  click: () => void;
}) {
  const date = new Date(data.timestamp + "T00:00:00");
  let classes = "";
  const isToday =
    date.toLocaleDateString("sv") === new Date().toLocaleDateString("sv");
  if (selected) {
    classes = "border-0 bg-yellow shadow-md2";
  } else if (isToday) {
    classes = "bg-light_yellow";
  } else {
    classes = "bg-white";
  }

  return (
    <Card className={"my-2 min-w-[130px] " + classes}>
      <div className="p-2" onClick={click}>
        <p className="mb-6 text-sm text-gray-600">
          {date.toLocaleString("en-us", { weekday: "long" })}
          <br />
          {isToday ? (
            <span className="  font-semibold text-secondary">Today</span>
          ) : (
            date.toLocaleString("en-us", { month: "short", day: "numeric" })
          )}
        </p>
        <p className="text-sm text-gray-600">Score</p>
        <h1 className="text-gray-600">
          {data.value !== -1 ? data.value.toFixed(1) : "-"}
        </h1>
      </div>
    </Card>
  );
}
