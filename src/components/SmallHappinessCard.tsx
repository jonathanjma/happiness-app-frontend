import { Happiness } from "../data/models/Happiness";
import { dateFromStr } from "../utils";
import Card from "./Card";
import Column from "./layout/Column";
import Row from "./layout/Row";

interface Action {
  label: string;
  modalId?: string;
  onClick?: () => void;
}

/**
 * `SmallHappinessCard` is a functional component that displays a small card with information about the Happiness object.
 *
 * @param {Happiness} happiness - An object of type `Happiness` which contains the details of a happiness event. It has properties like `value`, `timestamp`, and `author` which contains the `username`.
 * @param {Action[]} actions - An optional array of `Action` objects. This will create buttons as seen in design
 */
export default function SmallHappinessCard({
  happiness,
  actions = [],
}: {
  happiness: Happiness;
  actions?: Action[];
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const happinessDate = dateFromStr(happiness.timestamp);

  return (
    <Card className="p-4">
      <Row className="items-center gap-x-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-light_yellow">
          <h4 className="text-secondary">{happiness.value.toFixed(1)}</h4>
        </div>
        <div className="w-1" />
        <Column>
          <p className="text-gray-600">{happiness.author.username}</p>
          <label className="font-normal text-gray-400">
            {happinessDate < today
              ? happinessDate.toLocaleDateString("en-us", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Today"}
          </label>
        </Column>
        <div className="flex flex-grow" />
        <Row className="gap-3">
          {actions.map((action, i) => (
            <div
              className="rounded-[4px] bg-gray-50 px-3 py-1 hover:cursor-pointer"
              onClick={action.onClick}
              data-hs-overlay={"#" + action.modalId}
              key={i}
            >
              <label className="text-gray-400">{action.label}</label>
            </div>
          ))}
        </Row>
      </Row>
      <div className="h-4" />
      <p className="max-lines-3 font-normal text-gray-600">
        {happiness.comment}
      </p>
    </Card>
  );
}
