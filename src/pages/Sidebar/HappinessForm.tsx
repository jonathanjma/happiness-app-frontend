import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TextareaAutosize from "react-textarea-autosize";
import HappinessNumber from "../../components/HappinessNumber";
import RadioButton from "../../components/RadioButton";
import { Constants, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness, NewHappiness } from "../../data/models/Happiness";
import { addNewHappiness } from "../../data/models/stateUtils";
import { formatDate, getDefaultDate } from "../../utils";

export default function HappinessForm({ height }: { height: number }) {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const abortController = useRef<AbortController>(new AbortController());

  const [comment, setComment] = useState("");
  const [networkingState, setNetworkingState] = useState<string>(
    Constants.FINISHED_MUTATION_TEXT,
  );

  const postHappinessTimeout = useRef<number | undefined>(undefined);

  const [radioValue, setRadioValue] = useState(
    formatDate(getDefaultDate()) === formatDate(new Date()) ? 2 : 1,
  );
  const getSelDate = (): Date => {
    if (radioValue === 1) {
      return new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1,
      );
    } else {
      return new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      );
    }
  };
  const [happiness, setHappiness] = useState(-1);

  const getAbortSignal = () => {
    return abortController.current.signal;
  };
  const postHappinessMutation = useMutation({
    mutationFn: (newHappiness: NewHappiness) =>
      api.post<Happiness>("/happiness/", newHappiness, {
        signal: getAbortSignal(),
      }),
    onSuccess: (response) => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
      });
      addNewHappiness(queryClient, response.data);
    },
    onError: (error: any) => {
      if (error.message !== "canceled") {
        setNetworkingState(Constants.ERROR_MUTATION_TEXT);
      }
    },
  });

  // add leave without saving popup
  window.onbeforeunload = () => {
    if (networkingState === Constants.LOADING_MUTATION_TEXT) {
      return Constants.LEAVE_WITHOUT_SAVING;
    }
  };
  // autofill old entry on load
  const {
    data,
  }: {
    data: Happiness[] | undefined;
    isError: boolean;
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
          end: formatDate(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
          ),
        })
        .then((res) => res.data),
  });

  // react to data
  useEffect(() => {
    const matchingEntry = data?.find(
      (h) => h.timestamp === formatDate(getSelDate()),
    );
    if (matchingEntry) {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      setHappiness(matchingEntry.value);
      setComment(matchingEntry.comment);
    } else {
      setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
      setHappiness(-1);
      setComment("");
    }
  }, [data, radioValue]);

  return (
    <>
      <div className="mb-4 flex w-full justify-center">
        <RadioButton
          radioValue={radioValue}
          setRadioValue={setRadioValue}
          labels={["Yesterday", "Today"]}
        />
      </div>
      <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-medium text-gray-600">
          {getSelDate().toLocaleString("en-us", { weekday: "long" })}
        </div>
        <div className="flex w-full items-center">
          <div className="text-raisin-600 w-4/5">
            <div className="text-lg font-semibold">
              {getSelDate().toLocaleDateString("en-us", { month: "long" }) +
                " " +
                getSelDate().getDate()}
            </div>
          </div>
          <HappinessNumber
            value={happiness}
            onChangeValue={(n: number) => {
              abortController.current.abort();
              abortController.current = new AbortController();
              const val: string = n.toString();
              if (parseFloat(val) >= 0) {
                setHappiness(parseFloat(val));
              }
              setNetworkingState(Constants.LOADING_MUTATION_TEXT);
              clearTimeout(postHappinessTimeout.current);
              postHappinessTimeout.current = setTimeout(() => {
                postHappinessMutation.mutate({
                  value: n,
                  comment: comment,
                  timestamp: formatDate(getSelDate()),
                });
              }, 1000);
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
            className={`scroll-hidden mt-2 min-h-[112px] w-full resize-none rounded-lg p-2 text-left text-sm font-medium text-gray-600 outline-none outline-1 outline-gray-100`}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              abortController.current.abort();
              abortController.current = new AbortController();
              const target = e.target as HTMLTextAreaElement;
              const value = target.value as string;
              setComment(value);
              setNetworkingState(Constants.LOADING_MUTATION_TEXT);
              clearTimeout(postHappinessTimeout.current);
              postHappinessTimeout.current = setTimeout(() => {
                postHappinessMutation.mutate({
                  value: happiness,
                  comment: value,
                  timestamp: formatDate(getSelDate()),
                });
              }, 1000);
            }}
          />
        </div>
        <div className="mt-2 flex w-full text-sm">
          <div className="w-full text-left font-medium text-gray-400">
            {networkingState}
          </div>
        </div>
      </div>
    </>
  );
}
