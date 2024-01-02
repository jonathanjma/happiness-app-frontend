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
import { formatDate } from "../../utils";

/**
 * The page for displaying statistics for the current user
 */
export default function Statistics() {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [radioValue, setRadioValue] = useState(1);
  const [graphTitle, setGraphTitle] = useState("Weekly Happiness");
  const [graphSubTitle, setGraphSubTitle] = useState("");
  const [viewingEntry, setViewingEntry] = useState<Happiness | undefined>(undefined);
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

  // // currently figuring out selectedEntry
  // const [selectedEntry, setSelectedEntry] = useState();
  // const [selectedDay, setSelectedDay] = useState(
  //   new Date(
  //     new Date().getFullYear(),
  //     new Date().getMonth(),
  //     new Date().getDate(),
  //   ),
  // );

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
            <div className={"h-[600px]"}>
              <Graph
                entries={data}
                graphTitle={graphTitle}
                graphSubTitle={graphSubTitle}
                showDay={radioValue === 1}
                uniqDays={true}
                range={[start, end]}
              />
            </div>
            {/* <div
              className={
                (radioValue === 1 ? "min-w-[50px]" : "min-w-[350px]") + " w-full ml-8"
              }
            > */}
            <div className={`ml-8 ${radioValue === 1 ? "min-w-[50px]" : "min-w-[340px] justify-self-end"}`}>
              <HappinessCalendar
                startDate={start}
                variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
                onSelectEntry={(entry: Happiness) => {
                  setViewingEntry(entry);
                }}
                openModalId="show-happiness-modal"
              />
            </div>
            {viewingEntry &&
              <HappinessViewerModal
                happiness={data[0]}
                id="show-happiness-modal"
              />
            }
          </Row>
        )}
      </div>
    </>
  );
}
