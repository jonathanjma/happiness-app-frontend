import { Happiness } from "../../data/models/Happiness";
import SmallHappinessCard from "../SmallHappinessCard";
import { useUser } from "../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Column from "../layout/Column";
import Card from "../Card";
import { dateFromStr } from "../../utils";
import Row from "../layout/Row";
import Button from "../Button";

/**
 * Group happiness modal component. Shows multiple happiness entries.
 * @param entries happiness entries to show
 * @param id id value for modal
 * @returns
 */

export default function GroupHappinessModal({
  entries,
  id,
}: {
  entries: Happiness[];
  id: string;
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const curDate = dateFromStr(entries[0].timestamp);
  const headerText = `${entries.length} ${
    entries.length === 1 ? "entry" : "entries"
  } on 
`;
  return (
    <Modal id={id} className="w-full bg-[rgba(247,239,215,0.75)]" noCard={true}>
      <>
        <Card className="mb-3 rounded-xl bg-yellow px-4 py-2">
          <div className="text-base font-medium text-secondary">
            {headerText}
            <span className="font-bold text-secondary">
              {curDate.toLocaleString("en-us", {
                weekday: "long",
              })}
              ,{" "}
              {curDate.toLocaleString("en-us", {
                month: "long",
              })}{" "}
              {curDate.getDate()}
            </span>
          </div>
        </Card>
        <Column className="scroll-hidden relative max-h-[69vh] space-y-3 overflow-auto">
          {entries.map((happiness) => (
            <div className="bg-[rgba(247,239,215,0.75)] md:w-[600px]">
              <SmallHappinessCard
                happiness={happiness}
                actions={
                  happiness.author.id === user!.id
                    ? [
                        {
                          label: "Open In Entries",
                          onClick: () => {
                            navigate(`/home?date=${happiness.timestamp}`);
                          },
                        },
                      ]
                    : []
                }
              />
            </div>
          ))}
          <div className="absolute sticky bottom-0 z-[10] min-h-[20px] w-full bg-gradient-to-b from-transparent to-[rgba(247,239,215,0.75)]"></div>
        </Column>
        <Row className="z-[10] mt-3 w-full justify-center">
          <Button
            label="Close"
            classNameBtn="bg-white border-gray-300"
            classNameText="text-gray-400 -text-secondary"
            associatedModalId={id}
          ></Button>
        </Row>
      </>
    </Modal>
  );
}
