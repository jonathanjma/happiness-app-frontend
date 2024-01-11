import Card from "../../components/Card";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
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
  let classes = "elevation-01";
  const isToday =
    date.toLocaleDateString("sv") === new Date().toLocaleDateString("sv");
  if (selected) {
    classes += " border-0 bg-yellow shadow-md2";
  } else if (data.value < 0) {
    classes += " bg-white";
  } else {
    classes += " bg-light_yellow";
  }

  return (
    <div className="relative">
      {isToday && (
        <p
          className={`absolute -translate-y-1/2 translate-x-1 transform rounded-3xl px-3 py-0.5 text-xs font-medium ${
            !selected ? "bg-yellow text-secondary" : "bg-secondary text-white"
          }`}
        >
          Today
        </p>
      )}

      <Card className={"h-[108px] w-[108px] p-[1px] " + classes}>
        <div className="flex flex-col p-3" onClick={click}>
          <Row>
            <Column>
              <label className="leading-4">
                {date.toLocaleString("en-us", { weekday: "long" })}
              </label>
              <p className="font-semibold  leading-5">
                {" "}
                {date.toLocaleString("en-us", {
                  month: "short",
                  day: "numeric",
                })}{" "}
              </p>
            </Column>
            <div className="flex flex-1" />
          </Row>

          <div className="h-2" />
          <label className="leading-4">Score</label>
          <h4 className="font-semibold leading-8 text-secondary">
            {data.value !== -1 ? data.value.toFixed(1) : "-"}
          </h4>
        </div>
      </Card>
    </div>
  );
}
