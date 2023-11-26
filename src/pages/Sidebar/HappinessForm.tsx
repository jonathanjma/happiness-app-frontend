import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, NewHappiness } from "../../data/models/Happiness";
import { validateHappiness, formatDate, formatHappinessNum } from "../../utils";
import TextareaAutosize from "react-textarea-autosize";
import HappinessNumber from "../../components/HappinessNumber";

export default function HappinessForm({ height }: { height: number }) {
  const { api } = useApi();

  const [comment, setComment] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("Updated");

  const postHappinessTimeout = useRef<number | undefined>(undefined);
  const isInitialRender = useRef(true);

  const [radioValue, setRadioValue] = useState(2);
  const [selDate, setSelDate] = useState(new Date());
  const [happiness, setHappiness] = useState(-1);

  const UNSUBMITTED = "Unsubmitted (enter number to submit)";
  const UPDATING = "Updating...";
  const UPDATED = "Updated";
  const ERROR = "Error loading/retrieving happiness";

  const postHappinessMutation = useMutation((newHappiness: NewHappiness) =>
    api.post("/happiness/", newHappiness),
  );

  // Updates comment and happiness when comment or happiness value changes.
  // If happiness value is not entered, does not submit anything.
  useEffect(() => {
    if (happiness === -1) {
      setSubmissionStatus(UNSUBMITTED);
    } else {
      setSubmissionStatus(UPDATING);
      clearTimeout(postHappinessTimeout.current);
      postHappinessTimeout.current = setTimeout(() => {
        postHappinessMutation.mutate({
          value: happiness,
          comment: comment,
          timestamp: formatDate(selDate),
        });
      }, 1000);
    }
  }, [comment, happiness]);

  // Changes submission status if happiness value is updated successfully and refetches data.
  useEffect(() => {
    if (postHappinessMutation.isSuccess && happiness !== -1) {
      setSubmissionStatus("Updated");
    }
    refetch();
  }, [postHappinessMutation.isSuccess]);

  // Changes selected date between today and yesterday when radioValue variable changes.
  useEffect(() => {
    setSelDate(() => {
      if (radioValue === 1) {
        return new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 1,
        );
      } else {
        return new Date();
      }
    });
  }, [radioValue]);

  // autofill old entry on load
  const {
    isLoading,
    data,
    isError,
    refetch,
  }: {
    isLoading: boolean;
    data: Happiness[] | undefined;
    isError: boolean;
    refetch: (
      queryFnArgs?: undefined,
    ) => Promise<Happiness[] | undefined | unknown>;
  } = useQuery(`happiness for user`, () => {
    return api
      .get("/happiness/", {
        start: formatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 1,
          ),
        ),
        end: formatDate(new Date()),
      })
      .then((res) => res.data);
  });

  // react to initial query
  useEffect(() => {
    if (isLoading || data === undefined) {
      // TODO from design: loading state for this submission box
      setSubmissionStatus(UPDATING);
    } else if (isError) {
      // TODO from design: error state for this submission box
      setSubmissionStatus(ERROR);
    } else {
      const idx: number = radioValue === 1 ? 0 : 1;
      if (data[idx] === undefined) {
        setSubmissionStatus(UNSUBMITTED);
        setHappiness(-1);
        setComment("");
      } else {
        setSubmissionStatus(UPDATED);
        setHappiness(data[idx].value);
        setComment(data[idx].comment);
      }
    }
  }, [isLoading, selDate]);

  return (
    <>
      <div className="mb-4 flex w-full justify-center">
        <button
          className={
            "w-1/2 rounded-l-lg border border-1.5 p-1 " +
            (radioValue === 1
              ? "border-yellow bg-yellow text-secondary"
              : "border-r-0.5 border-gray-100 bg-white text-dark_gray")
          }
          onClick={() => {
            setRadioValue(1);
          }}
        >
          <label
            className={
              "text-base " +
              (radioValue === 1 ? "font-semibold" : "font-medium")
            }
          >
            Yesterday
          </label>
        </button>
        <button
          className={
            "border-right w-1/2 rounded-r-lg border-1.5 p-1 " +
            (radioValue === 2
              ? "border-yellow bg-yellow text-secondary"
              : "border-l-0.5 border-gray-100 bg-white text-dark_gray")
          }
          onClick={() => {
            setRadioValue(2);
          }}
        >
          <label
            className={
              "text-base " +
              (radioValue === 2 ? "font-semibold" : "font-medium")
            }
          >
            Today
          </label>
        </button>
      </div>
      <div className="mb-4 rounded-xl bg-white p-4">
        <div className="text-sm font-medium text-dark_gray">
          {selDate.toLocaleString("en-us", { weekday: "long" })}
        </div>
        <div className="flex w-full items-center">
          <div className="text-raisin-600 w-4/5">
            <div className="text-lg font-semibold">
              {selDate.toLocaleDateString("en-us", { month: "long" }) +
                " " +
                selDate.getDate()}
            </div>
          </div>
          <HappinessNumber
            value={happiness}
            onChangeValue={(n: number) => {
              const val: string = n.toString();
              if (parseFloat(val) >= 0) {
                setHappiness(parseFloat(val));
              }
            }}
            editable={true}
            sidebarStyle={true}
          />
        </div>
        <div className="mt-1.5 flex w-full justify-center">
          {/* 662 = height in px of other sidebar elements */}
          <TextareaAutosize
            value={comment}
            minRows={3}
            maxRows={Math.max(3, Math.floor((height - 662) / 24))}
            className={`mt-2 min-h-[112px] w-full resize-none overflow-hidden rounded-lg p-2 text-left text-sm font-medium text-dark_gray outline-none outline-1 outline-gray-100`}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              const value = target.value as string;
              setComment(value);
            }}
          />
        </div>
        <div className="mt-2 flex w-full text-sm">
          <div className="w-1/2 font-medium text-dark_gray">
            {radioValue === 2
              ? selDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
          {/* Currently the time doesn't update so i need to fix that */}
          <div className="w-1/2 text-right font-medium text-light_gray">
            {submissionStatus}
          </div>
        </div>
      </div>
    </>
  );
}
