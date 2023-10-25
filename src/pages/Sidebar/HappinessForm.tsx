import { useState, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, NewHappiness } from "../../data/models/Happiness";
import { validateHappiness, formatDate } from "../../utils";

export default function HappinessForm() {
  const { api } = useApi();

  const [comment, setComment] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("Updated");
  // TODO refactor to use useRef! the let def was being reassigned
  // on every recomposition
  const postHappinessTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialRender = useRef(true);
  const commentBox = useRef();

  const [radioValue, setRadioValue] = useState(2);
  const [selDate, setSelDate] = useState(new Date());
  const [happiness, setHappiness] = useState(-1);

  const UNSUBMITTED = "Unsubmitted (change the number to submit)";
  const UPDATING = "Updating...";
  const UPDATED = "Updated";
  const ERROR = "Error loading/retrieving happiness";

  const postHappinessMutation = useMutation((newHappiness: NewHappiness) =>
    api.post("/happiness/", newHappiness),
  );

  useEffect(() => {
    if (validateHappiness(happiness)) {
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

  useEffect(() => {
    if (postHappinessMutation.isSuccess) {
      setSubmissionStatus("Updated");
    }
  }, [postHappinessMutation.isSuccess]);

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

  return (
    <>
      <div className="w-full flex justify-center mb-4 divide-x-0">
        <button
          className={
            "p-1 border border-light_gray w-1/2 text-sm rounded-l-lg text-black font-medium " +
            (radioValue === 1 ? "bg-medium_yellow" : "bg-white")
          }
          onClick={() => {
            setRadioValue(1);
          }}
        >
          <label className="text-brown">Yesterday</label>
        </button>
        <button
          className={
            "p-1 border border-light_gray w-1/2 text-sm rounded-r-lg text-black font-medium " +
            (radioValue === 2 ? "bg-medium_yellow" : "bg-white")
          }
          onClick={() => {
            setRadioValue(2);
          }}
        >
          <label className="text-brown">Today</label>
        </button>
      </div>
      <div className="p-4 bg-white rounded-xl mb-4">
        <div className="font-medium text-sm text-dark_gray">
          {selDate.toLocaleString("en-us", { weekday: "long" })}
        </div>
        <div className="w-full flex items-center">
          <div className="w-4/5 text-raisin-600">
            <div className="text-xl font-semibold">
              {selDate.toLocaleDateString("en-us", { month: "long" }) +
                " " +
                selDate.getDate()}
            </div>
          </div>
          {/* <input
            className="w-16 h-8 text-base text-center rounded-md bg-gray-100 focus:border-raisin-600 focus:border-1 font-semibold"
            type="number"
            inputMode="decimal"
            value={happiness === -1 ? "" : happiness}
            placeholder=""
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement
              if (target.value < 0) {
                setHappiness(0);
              } else if (e.target.value > 10) {
                setHappiness(10);
              } else if (e.target.value.length > 3) {
                setHappiness(e.target.value.toString().substring(0, 3));
              } else {
                setHappiness(e.target.value);
              }
            }}
            onBlur={() => {
              if (happiness !== 10) {
                setHappiness((prevHappiness) =>
                  formatHappinessNum(prevHappiness),
                );
              }
            }}
          /> */}
        </div>
      </div>
    </>
  );
}
