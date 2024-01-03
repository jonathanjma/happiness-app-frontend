import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import DateRangeSwitcher from "../../components/DateRangeSwitcher";
import Graph from "../../components/Graph";
import HappinessCalendar from "../../components/HappinessCalendar";
import Row from "../../components/layout/Row";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Happiness } from "../../data/models/Happiness";
import { formatDate, useWindowDimensions } from "../../utils";
import Button from "../../components/Button";

/**
 * The page for displaying statistics for the current user
 */
export default function Statistics() {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [radioValue, setRadioValue] = useState(1);
  const [graphTitle, setGraphTitle] = useState("Weekly Happiness");
  const [graphSubTitle, setGraphSubTitle] = useState("");
  const [viewingEntry, setViewingEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [calCollapsed, setCalCollapsed] = useState<boolean>(false);
  const [start, setStart] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7,
    ),
  );
  const [end, setEnd] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  );

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
    queryKey: QueryKeys.FETCH_HAPPINESS + " graph query",
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
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - new Date().getDay(),
        );
      } else {
        return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      }
    });
    setEnd(() => {
      if (radioValue === 1) {
        return new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - new Date().getDay() + 6,
        );
      } else {
        return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
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
  }, [data, start, end, graphTitle]);

  // console.log(start);
  // console.log(end);

  return (
    <>
      <div className="mx-[32px] my-[96px]">
        <Row className="pb-4">
          <div className="text-4xl font-medium">Your Stats</div>
          <div className="flex flex-1" />
          <DateRangeSwitcher
            radioValue={radioValue}
            setRadioValue={setRadioValue}
            dates={[start, end]}
            setCurDates={[setStart, setEnd]}
          />
        </Row>
        {isError || isLoading || data === undefined ? (
          <></>
        ) : (
          <Row className="w-full">
            <div className={`h-[600px] w-full`}>
              <Graph
                entries={data}
                graphTitle={graphTitle}
                graphSubTitle={graphSubTitle}
                showDay={radioValue === 1}
                uniqDays={true}
                range={[start, end]}
              />
            </div>
            <div
              className={`ml-8 ${
                radioValue === 1 || calCollapsed
                  ? "min-w-[50px]" + calCollapsed
                    ? " my-4"
                    : ""
                  : "my-4 min-w-[340px] justify-self-end"
              }`}
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
                <div className="p-1">
                  <HappinessCalendar
                    startDate={start}
                    variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
                    onSelectEntry={(entry: Happiness) => {
                      setViewingEntry(entry);
                    }}
                    openModalId="show-happiness-modal"
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
      {calCollapsed ? <ExpandLeft /> : <ExpandRight />}
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

const ExpandLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.94773 11.3543C5.41326 11.9298 5.41326 12.8202 5.94773 13.3957L9.78252 17.5251C10.061 17.825 10.5125 17.825 10.791 17.5251C11.0694 17.2252 11.0694 16.7391 10.791 16.4392L7.01671 12.375L10.791 8.31081C11.0694 8.01095 11.0694 7.52477 10.791 7.2249C10.5125 6.92503 10.061 6.92503 9.78252 7.2249L5.94773 11.3543ZM15.7825 7.2249L11.9477 11.3543C11.4133 11.9298 11.4133 12.8202 11.9477 13.3957L15.7825 17.5251C16.061 17.825 16.5125 17.825 16.791 17.5251C17.0694 17.2252 17.0694 16.7391 16.791 16.4392L13.0167 12.375L16.791 8.31081C17.0694 8.01095 17.0694 7.52477 16.791 7.2249C16.5125 6.92503 16.061 6.92503 15.7825 7.2249Z"
      fill="#212121"
    />
  </svg>
);

const ExpandRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.0523 11.3543C18.5867 11.9298 18.5867 12.8202 18.0523 13.3957L14.2175 17.5251C13.939 17.825 13.4875 17.825 13.209 17.5251C12.9306 17.2252 12.9306 16.7391 13.209 16.4392L16.9833 12.375L13.209 8.31081C12.9306 8.01095 12.9306 7.52477 13.209 7.2249C13.4875 6.92503 13.939 6.92503 14.2175 7.2249L18.0523 11.3543ZM8.21748 7.2249L12.0523 11.3543C12.5867 11.9298 12.5867 12.8202 12.0523 13.3957L8.21748 17.5251C7.939 17.825 7.48751 17.825 7.20903 17.5251C6.93056 17.2252 6.93056 16.7391 7.20903 16.4392L10.9833 12.375L7.20903 8.31081C6.93056 8.01095 6.93056 7.52477 7.20903 7.2249C7.48751 6.92503 7.939 6.92503 8.21748 7.2249Z"
      fill="#212121"
    />
  </svg>
);
