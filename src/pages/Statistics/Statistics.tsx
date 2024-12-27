import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import ExpandLeftIcon from "../../assets/ExpandLeftIcon";
import ExpandRightIcon from "../../assets/ExpandRightIcon";
import DateRangeSwitcher from "../../components/DateRangeSwitcher";
import Graph from "../../components/Graph";
import HappinessCalendar from "../../components/HappinessCalendar";
import Row from "../../components/layout/Row";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness } from "../../data/models/Happiness";
import { formatDate, useWindowDimensions } from "../../utils";
import SearchBar from "./SearchBar";
import Stat from "./Stat";

/**
 * The page for displaying statistics for the current user
 */
export default function Statistics() {
  const { api } = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const location = useLocation();
  const [text, setText] = useState(location?.state?.text ?? "");
  const [startValue, setStartValue] = useState(
    location?.state?.startValue ?? 0,
  );
  const [endValue, setEndValue] = useState(location?.state?.endValue ?? 10);
  const [startDate, setStartDate] = useState(location?.state?.startDate ?? "");
  const [endDate, setEndDate] = useState(location?.state?.endDate ?? "");

  const settingsNames = user!.settings.map((e) => e.key);
  const [radioValue, setRadioValue] = useState(1);
  const [graphTitle, setGraphTitle] = useState("Weekly Happiness");
  const [graphSubTitle, setGraphSubTitle] = useState("");
  const [viewingEntry, setViewingEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [calCollapsed, setCalCollapsed] = useState<boolean>(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  useEffect(() => {
    if (viewingEntry) {
      window.HSOverlay.open(document.querySelector("#show-happiness-modal"));
    }
  }, [viewingEntry]);

  const { width, height } = useWindowDimensions();

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
    queryKey: [
      QueryKeys.FETCH_HAPPINESS,
      " graph query",
      { start: start },
      { end: end },
    ],
    queryFn: () =>
      api
        .get("/happiness/", {
          start: formatDate(start),
          end: formatDate(end),
        })
        .then((res) => res.data),
  });

  // Changes selected date range between current week and current month when radioValue variable changes.
  useEffect(() => {
    setStart(() => {
      if (radioValue === 1) {
        return new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() - start.getDay(),
        );
      } else {
        return new Date(end.getFullYear(), end.getMonth(), 1);
      }
    });
    setEnd(() => {
      if (radioValue === 1) {
        return new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() - start.getDay() + 6,
        );
      } else {
        return new Date(end.getFullYear(), end.getMonth() + 1, 0);
      }
    });
    setGraphTitle(() =>
      radioValue === 1 ? "Weekly Happiness" : "Monthly Happiness",
    );
  }, [radioValue]);

  // change subtitle when data changes
  useEffect(() => {
    setGraphSubTitle(
      () =>
        start.toLocaleString("default", { month: "long" }) +
        " " +
        (radioValue === 1
          ? start.getDate() +
            "-" +
            (start.getMonth() === end.getMonth()
              ? ""
              : end.toLocaleString("default", { month: "long" }) + " ") +
            end.getDate()
          : start.getFullYear()),
    );
  }, [data, radioValue, start, end]);

  // react to changes in data
  useEffect(() => {
    refetch();
  }, [data, start, end]);

  // list of statistic settings
  const setNames = [
    "Show Average",
    "Show Median",
    "Show Mode",
    "Show Standard Deviation",
    "Show Minimum Value",
    "Show Maximum Value",
  ];

  return (
    <>
      <div className="mx-[32px] my-[96px] flex-1">
        <Row>
          <div className="text-4xl font-medium">Your Stats</div>
          <div className="flex flex-1" />
          <DateRangeSwitcher
            radioValue={radioValue}
            setRadioValue={setRadioValue}
            dates={[start, end]}
            setCurDates={[setStart, setEnd]}
          />
        </Row>
        <Row className="my-8">
          <SearchBar
            text={text}
            setText={setText}
            startValue={startValue}
            setStartValue={setStartValue}
            endValue={endValue}
            setEndValue={setEndValue}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Row>
        {isError || isLoading || data === undefined ? (
          <></>
        ) : (
          <>
            <Row className="w-full">
              <div className={`w-full flex-1`}>
                <Graph
                  entries={data}
                  graphTitle={graphTitle}
                  graphSubTitle={graphSubTitle}
                  showDay={radioValue === 1}
                  uniqDays={true}
                  range={[start, end]}
                  onSelectEntry={(entry: Happiness[]) => {
                    if (viewingEntry && viewingEntry.id === entry[0].id) {
                      window.HSOverlay.open(
                        document.querySelector("#show-happiness-modal"),
                      );
                    } else {
                      setViewingEntry(entry[0]);
                    }
                  }}
                />
                <Row className="flex justify-center space-x-4">
                  {data.length === 0 ? (
                    <></>
                  ) : (
                    setNames.map((val, t) => {
                      if (val) {
                        return (
                          <Stat
                            values={data.map((e) => e.value)}
                            key={t}
                            statName={t}
                          />
                        );
                      }
                    })
                  )}
                </Row>
              </div>
              <div
                className={`ml-8 ${
                  radioValue === 1 || calCollapsed
                    ? "min-w-[50px]"
                    : "min-w-[340px] justify-self-end"
                } ${radioValue === 1 && calCollapsed ? "my-4" : ""}`}
              >
                {radioValue === 2 ? (
                  <ExpandMonthCal
                    calCollapsed={calCollapsed}
                    setCalCollapsed={setCalCollapsed}
                    monthLabel={graphSubTitle}
                  />
                ) : (
                  <></>
                )}
                {calCollapsed && radioValue === 2 ? (
                  <></>
                ) : (
                  <div className="-z-50 p-1">
                    <HappinessCalendar
                      startDate={start}
                      variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
                      selectedEntry={viewingEntry ? [viewingEntry] : undefined}
                      onSelectEntry={(entry: Happiness[]) => {
                        if (viewingEntry && viewingEntry.id === entry[0].id) {
                          window.HSOverlay.open(
                            document.querySelector("#show-happiness-modal"),
                          );
                        } else {
                          setViewingEntry(entry[0]);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              {viewingEntry && (
                <HappinessViewerModal
                  happiness={viewingEntry}
                  id="show-happiness-modal"
                />
              )}
            </Row>
          </>
        )}
      </div>
    </>
  );
}

const ExpandMonthCal = ({
  calCollapsed,
  setCalCollapsed,
  monthLabel,
}: {
  calCollapsed: boolean;
  setCalCollapsed: (newValue: boolean) => void;
  monthLabel: string;
}) => (
  <Row className="w-full">
    <div
      className={
        "flex flex-col items-center justify-center bg-gray-50 hover:cursor-pointer" +
        " h-[32px] w-[32px] rounded-lg border-1 border-gray-100 p-[4px]"
      }
      onClick={() => setCalCollapsed(!calCollapsed)}
    >
      {calCollapsed ? <ExpandLeftIcon /> : <ExpandRightIcon />}
    </div>
    {calCollapsed ? (
      <></>
    ) : (
      <>
        <div className="flex flex-1" />
        <div className="justify-self-end text-sm font-medium text-gray-400">
          {monthLabel}
        </div>
      </>
    )}
  </Row>
);
