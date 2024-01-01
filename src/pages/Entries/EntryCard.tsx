import { useQuery } from "react-query";
import EditIcon from "../../assets/edit.svg";
import Button from "../../components/Button";
import Comments from "../../components/Comments";
import HappinessNumber from "../../components/HappinessNumber";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { useApi } from "../../contexts/ApiProvider";
import { Comment } from "../../data/models/Comment";
import { Happiness } from "../../data/models/Happiness";
import { Constants } from "../../constants";
import IconWarningOutline from "../../assets/IconWarningOutline";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

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
  const { api } = useApi();

  // Fetch comments
  const commentsResult = useQuery<Comment[]>(
    [`happinessComments ${happiness.id}`],
    () => {
      if (happiness.id >= 0) {
        return api
          .get<Comment[]>(`/happiness/${happiness.id}/comments`)
          .then((res) => res.data);
      }
      return [];
    },
  );

  return (
    <>
      <Column
        className={
          "flex-1 items-stretch rounded-2xl bg-white p-6 shadow-2xl " +
          className
        }
      >
        {/* Header text */}
        <Row className="items-center">
          <p className="text-dark_gray">You don't have a private entry</p>
          <span className="w-3" />
          <p
            className="clickable-text font-semibold leading-4 text-secondary underline hover:cursor-pointer"
            onClick={() => {
              console.log("TODO open private entries page");
            }}
          >
            Create a Private Entry
          </p>
        </Row>

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8.48755 7.79735H8.48237L8.49121 7.80619L11.0003 10.3155L10.3155 11.0003L7.51258 8.19745V4.67923H8.48755V7.79735ZM8.00118 14.3209C7.12685 14.3209 6.30519 14.155 5.53607 13.8232C4.76669 13.4914 4.09757 13.0411 3.52858 12.4724C2.95959 11.9036 2.5091 11.2348 2.17711 10.4658C1.84522 9.697 1.67925 8.87551 1.67925 8.00118C1.67925 7.12685 1.84515 6.30519 2.17689 5.53607C2.50874 4.76669 2.95903 4.09757 3.52776 3.52859C4.09649 2.95959 4.76532 2.5091 5.53435 2.17711C6.30313 1.84522 7.12462 1.67925 7.99895 1.67925C8.87328 1.67925 9.69494 1.84515 10.4641 2.17689C11.2334 2.50874 11.9026 2.95903 12.4715 3.52776C13.0405 4.09649 13.491 4.76532 13.823 5.53435C14.1549 6.30313 14.3209 7.12462 14.3209 7.99895C14.3209 8.87328 14.155 9.69494 13.8232 10.4641C13.4914 11.2334 13.0411 11.9026 12.4724 12.4715C11.9036 13.0405 11.2348 13.491 10.4658 13.823C9.697 14.1549 8.87551 14.3209 8.00118 14.3209ZM8.00006 13.3459C9.48114 13.3459 10.7427 12.8252 11.7839 11.7839C12.8252 10.7427 13.3459 9.48114 13.3459 8.00007C13.3459 6.51899 12.8252 5.25747 11.7839 4.21623C10.7427 3.17498 9.48114 2.65423 8.00006 2.65423C6.51899 2.65423 5.25747 3.17498 4.21623 4.21623C3.17498 5.25747 2.65423 6.51899 2.65423 8.00007C2.65423 9.48114 3.17498 10.7427 4.21623 11.7839C5.25747 12.8252 6.51899 13.3459 8.00006 13.3459Z"
                      fill="#808080"
                      stroke="#808080"
                      stroke-width="0.025"
                    />
                  </svg>
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
        {/* TODO fix confirmation modal to parse date correct;y */}
        body={`You are deleting happiness for ${new Date(
          happiness.timestamp,
        ).toDateString()}, are you sure you want to continue?`}
        denyText="Cancel"
        confirmText="Continue"
        onConfirm={onDeleteHappiness}
      />
    </>
  );
}
