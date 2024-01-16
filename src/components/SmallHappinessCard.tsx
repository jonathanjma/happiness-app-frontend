import TimeAgo from "javascript-time-ago";
import { Happiness } from "../data/models/Happiness";
import { parseYYYYmmddFormat } from "../utils";
import Card from "./Card";
import Column from "./layout/Column";
import Row from "./layout/Row";

interface Action {
  label: string;
  onClick: () => void;
}
export default function SmallHappinessCard({ happiness, actions = [] }: { happiness: Happiness, actions?: Action[]; }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const happinessDate = parseYYYYmmddFormat(happiness.timestamp);
  const timeAgo = new TimeAgo("en-us");

  return (
    <Card className="p-4">
      <Row className="items-center">
        <div className="bg-light_yellow rounded-[4px] w-11 h-11 flex items-center justify-center">
          <h4 className="text-secondary">{happiness.value}</h4>
        </div>
        <div className="w-1" />
        <Column>
          <p className="text-gray-600">{happiness.author.username}</p>
          <label className="text-gray-400">{
            happinessDate < today ?
              happinessDate.toLocaleDateString("en-us", {
                month: "long",
                day: "numeric",
                year: "numeric"
              }) : timeAgo.format(happinessDate)
          }</label>
        </Column>
        <div className="flex flex-grow" />
        <Row className="gap-3">
          {actions.map((action) =>
            <div
              className="px-3 py-1 bg-gray-50 rounded-[4px]"
              onClick={action.onClick}
            >
              <label>{action.label}</label>
            </div>
          )}
        </Row>
      </Row>
      <div className="h-4" />
      <p className="text-gray-600 w-full">{happiness.comment}</p>
    </Card>
  );
}
