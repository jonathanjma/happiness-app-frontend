import * as React from "react";
import Card from "../../components/Card";
import { Happiness } from "../../data/models/Happiness";

export default function HappinessCard({
  data,
  click,
}: {
  data: Happiness;
  click: () => void;
}) {
  const date = new Date(data.timestamp + "T00:00:00");

  return (
    <Card className="my-2">
      <div className="p-2" onClick={click}>
        <p className="text-sm text-dark_gray mb-6">
          {date.toLocaleString("en-us", { weekday: "long" })}
          <br />
          {date.toLocaleString("en-us", { month: "short", day: "numeric" })}
        </p>
        <p className="text-sm text-dark_gray">Score</p>
        <h1 className="text-dark_gray">
          {data.value !== -1 ? data.value.toFixed(1) : "-"}
        </h1>
      </div>
    </Card>
  );
}
