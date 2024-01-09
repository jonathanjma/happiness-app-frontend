import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import IconClock from "../../assets/IconClock";
import IconWarningOutline from "../../assets/IconWarningOutline";
import EditIcon from "../../assets/edit.svg";
import Button from "../../components/Button";
import Comments from "../../components/Comments";
import HappinessNumber from "../../components/HappinessNumber";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import EntryTextSkeleton from "../../components/skeletons/EntryTextSkeleton";
import { Constants, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness } from "../../data/models/Happiness";
import { parseYYYYmmddFormat } from "../../utils";

/**
 * The Big Entry Card component to display an entry on the entries page
 * @param className style to add to the entry card, overrides default styles
 * @param happiness the Happiness object to display on the entry card.
 * If the happiness value is negative one it represents no happiness for this day
 * @returns
 */
export default function EntryCard({
  className,
  happiness,
  onChangeHappinessNumber,
  onChangeCommentText,
  onDeleteHappiness,
  editing,
  setEditing,
  networkingState,
  setNetworkingState,
}: {
  happiness: Happiness;
  className?: string;
  onChangeHappinessNumber: (value: number) => void;
  onChangeCommentText: (value: string) => void;
  onDeleteHappiness: () => void;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  networkingState: string;
  setNetworkingState: React.Dispatch<React.SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const { api } = useApi();
  const { data: count } = useQuery([QueryKeys.FETCH_JOURNAL_COUNT], {
    queryFn: () =>
      api.get<Number>("/journal/dates/count/", { start: happiness.timestamp, end: happiness.timestamp })
        .then((res) => res.data)
  });

  return (
    <>
      <Column
        className={
          "flex-1 items-stretch rounded-2xl bg-white p-6 shadow-2xl " +
          className
        }
      >
        {/* Header text */}
        {count ? <Row className="items-center">
          <p className="text-dark_gray">{count.number > 0 ?
            "You have a private entry for this date."
            : "You don't have a private entry for this date."}</p>
          <span className="w-3" />
          <p
            className="clickable-text font-semibold leading-4 text-secondary underline hover:cursor-pointer"
            onClick={() => {
              navigate("/journal", { state: { date: happiness.timestamp } });
            }}
          >
            {count.number > 0 ? "View Private Entry" : "Create a Private Entry"}
          </p>
        </Row> : <EntryTextSkeleton />}


        <div className=" h-4" />

        {/* Public entry and edit button */}
        <Row>
          <Column>
            <h4>Public Entry</h4>
            <h5 className=" text-dark_gray">
              {new Date(happiness.timestamp).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </h5>
          </Column>
          <div className="flex-1" />
          {editing ? (
            <>
              {happiness.value !== -1 && (
                <>
                  <Button
                    variation="OUTLINED"
                    label="Delete Entry"
                    associatedModalId="delete-confirm-modal"
                  />
                  <div className=" w-4" />
                </>
              )}
              <Button label="Done" onClick={() => setEditing(false)} />
            </>
          ) : (
            <Button
              label="Edit Entry"
              icon={<img src={EditIcon as any} />}
              onClick={() => {
                setEditing((e) => !e);
              }}
            />
          )}
        </Row>
        {/* Entry and score */}
        <Row className="mt-6 h-1/4  w-full">
          <Column className="border-primary-500 flex h-full min-w-[80px] items-center ">
            <HappinessNumber
              value={happiness.value}
              onChangeValue={onChangeHappinessNumber}
              editable={editing}
              setNetworkingState={setNetworkingState}
            />
          </Column>
          <div className=" w-6" />
          <Column className="w-full">
            <textarea
              placeholder="Write about your day"
              className={
                "h-full w-full resize-none rounded-lg bg-transparent focus:outline-none " +
                (editing ? "border-1 border-solid border-gray-200 p-5" : "")
              }
              value={happiness.comment}
              disabled={!editing}
              onChange={(e) => {
                onChangeCommentText(e.target.value);
              }}
            />
            {/* Editing status text */}
            {editing && (
              <Row className="mt-1 gap-1">
                {happiness.value === -1 ||
                  networkingState === Constants.ERROR_MUTATION_TEXT ? (
                  <IconWarningOutline color="#808080" />
                ) : (
                  <IconClock />
                )}

                <p className=" text-[12px] font-normal  leading-4 text-gray-400">
                  {networkingState}
                </p>
              </Row>
            )}
          </Column>
        </Row>
        <div className="h-8" />
        {/* Comments */}
        <Column className="h-0 w-full flex-1 items-stretch">
          <Comments associatedHappinessId={happiness.id} modalVariant={false} />
        </Column>
      </Column>
      <ConfirmationModal
        id="delete-confirm-modal"
        title="Deleting happiness"
        // fix comment form
        body={`You are deleting happiness for ${parseYYYYmmddFormat(
          happiness.timestamp,
        ).toDateString()}, are you sure you want to continue?`}
        denyText="Cancel"
        confirmText="Continue"
        onConfirm={onDeleteHappiness}
      />
    </>
  );
}
