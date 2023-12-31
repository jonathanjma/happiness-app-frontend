import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TextareaAutosize from "react-textarea-autosize";
import HappinessNumber from "../../components/HappinessNumber";
import { Constants, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, NewHappiness } from "../../data/models/Happiness";
import { formatDate } from "../../utils";

export default function HappinessForm({ height }: { height: number }) {
  const { api } = useApi();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const [networkingState, setNetworkingState] = useState<string>(
    Constants.FINISHED_MUTATION_TEXT,
  );

  const postHappinessTimeout = useRef<number | undefined>(undefined);

  const [radioValue, setRadioValue] = useState(2);
  const [selDate, setSelDate] = useState(new Date());
  const [happiness, setHappiness] = useState(-1);

  const postHappinessMutation = useMutation((newHappiness: NewHappiness) =>
    api.post("/happiness/", newHappiness),
  );

  // Updates comment and happiness when comment or happiness value changes.
  // If happiness value is not entered, does not submit anything.
  useEffect(() => {
    if (happiness === -1) {
      setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
    } else {
      setNetworkingState(Constants.LOADING_MUTATION_TEXT);
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
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes(QueryKeys.FETCH_HAPPINESS),
      });
    }
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
  } = useQuery({
    queryKey: QueryKeys.FETCH_HAPPINESS + " sidebar query",
    queryFn: () =>
      api
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
        .then((res) => res.data),
  });

  // react to data
  useEffect(() => {
    if (isLoading || data === undefined) {
      // TODO from design: loading state for this submission box
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
    } else if (isError) {
      // TODO from design: error state for this submission box
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
    } else {
      const idx: number = radioValue === 1 ? 0 : 1;
      if (data[idx] === undefined) {
        setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
        setHappiness(-1);
        setComment("");
      } else {
        setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
        setHappiness(data[idx].value);
        setComment(data[idx].comment);
      }
    }
  }, [data, selDate]);

  return (
    <>
      <div className="mb-4 flex w-full justify-center">
        <button
          className={
            "w-1/2 rounded-l-lg border p-1 " +
            (radioValue === 1
              ? "border-yellow bg-yellow text-secondary"
              : "border-r-0.5 border-gray-100 bg-white text-gray-600")
          }
          onClick={() => {
            setRadioValue(1);
          }}
        >
          <label className="text-base font-semibold">Yesterday</label>
        </button>
        <button
          className={
            "border-right w-1/2 rounded-r-lg border-1.5 p-1 " +
            (radioValue === 2
              ? "border-yellow bg-yellow text-secondary"
              : "border-l-0.5 border-gray-100 bg-white text-gray-600")
          }
          onClick={() => {
            setRadioValue(2);
          }}
        >
          <label className="text-base font-semibold">Today</label>
        </button>
      </div>
      <div className="mb-4 rounded-xl bg-white p-4">
        <div className="text-sm font-medium text-gray-600">
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
            setNetworkingState={setNetworkingState}
          />
        </div>
        <div className="mt-1.5 flex w-full justify-center">
          {/* 662 = height in px of other sidebar elements */}
          <TextareaAutosize
            value={comment}
            minRows={3}
            maxRows={Math.max(3, Math.floor((height - 662) / 24))}
            className={`mt-2 min-h-[112px] w-full resize-none overflow-hidden rounded-lg p-2 text-left text-sm font-medium text-gray-600 outline-none outline-1 outline-gray-100`}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              const value = target.value as string;
              setComment(value);
            }}
          />
        </div>
        <div className="mt-2 flex w-full text-sm">
          <div className="w-1/2 font-medium text-gray-600">
            {radioValue === 2
              ? selDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
          {/* Currently the time doesn't update so i need to fix that */}
          <div className="w-1/2 text-right font-medium text-gray-400">
            {networkingState}
          </div>
        </div>
      </div>
    </>
  );
}
