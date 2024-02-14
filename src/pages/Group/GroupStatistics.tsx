import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import ExpandLeftIcon from "../../assets/ExpandLeftIcon";
import ExpandRightIcon from "../../assets/ExpandRightIcon";
import DateRangeSwitcher from "../../components/DateRangeSwitcher";
import Graph from "../../components/Graph";
import HappinessCalendar from "../../components/HappinessCalendar";
import Row from "../../components/layout/Row";
import GroupHappinessModal from "../../components/modals/GroupHappinessModal";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness } from "../../data/models/Happiness";
import { formatDate, useWindowDimensions } from "../../utils";
import Stat from "../Statistics/Stat";
import { Group } from "../../data/models/Group";
import { format } from "mathjs";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";

/**
 * The page for displaying statistics for a group given group data
 */
export default function GroupStatistics({
  groupData,
  radioValue,
  setRadioValue,
  startDate,
  endDate,
  setCurDates,
}: {
  groupData: Group;
  radioValue: number;
  setRadioValue: (newValue: number) => void;
  startDate: Date;
  endDate: Date;
  setCurDates: ((newValue: Date) => void)[];
}) {
  const { api } = useApi();

  const [graphTitle, setGraphTitle] = useState<string>("Weekly Happiness");
  const [graphSubTitle, setGraphSubTitle] = useState("");
  const [viewingEntry, setViewingEntry] = useState<Happiness[] | undefined>(
    undefined,
  );
  const [singleEntry, setSingleEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [calCollapsed, setCalCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (viewingEntry) {
      window.HSOverlay.open(document.querySelector("#group-happiness-modal"));
    }
  }, [viewingEntry]);

  const { width, height } = useWindowDimensions();

  const {
    isLoading,
    isError,
    data,
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
      QueryKeys.FETCH_GROUP_HAPPINESS,
      {
        start: formatDate(startDate),
        end: formatDate(endDate),
        id: groupData.id,
      },
    ],
    queryFn: () =>
      api
        .get<Happiness[]>(`/group/${groupData.id}/happiness`, {
          start: formatDate(startDate),
          end: formatDate(endDate),
        })
        .then((res) => res.data),
  });

  // change title when data changes
  useEffect(() => {
    setGraphTitle(radioValue === 1 ? "Weekly Happiness" : "Monthly Happiness");
  }, [radioValue]);

  // change subtitle when data changes
  useEffect(() => {
    setGraphSubTitle(
      () =>
        startDate.toLocaleString("default", { month: "long" }) +
        " " +
        (radioValue === 1
          ? startDate.getDate() +
            "-" +
            (startDate.getMonth() === endDate.getMonth()
              ? ""
              : endDate.toLocaleString("default", { month: "long" }) + " ") +
            endDate.getDate()
          : startDate.getFullYear()),
    );
  }, [data, radioValue, startDate, endDate]);

  // react to changes in data
  useEffect(() => {
    refetch();
  }, [data, startDate, endDate]);

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
      <div className="mx-[32px] flex-1">
        <Row className="pb-8">
          <div className="flex flex-1" />
          <DateRangeSwitcher
            radioValue={radioValue}
            setRadioValue={setRadioValue}
            dates={[startDate, endDate]}
            setCurDates={setCurDates}
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
                  range={[startDate, endDate]}
                  users={groupData.users.map((user) => user.username)}
                  onSelectEntry={(entry: Happiness[]) => {
                    if (viewingEntry && viewingEntry[0].id === entry[0].id) {
                      window.HSOverlay.open(
                        document.querySelector("#group-happiness-modal"),
                      );
                    } else {
                      setViewingEntry(entry);
                    }
                  }}
                />
                <Row className="flex justify-center space-x-4">
                  {data.length === 0 ? (
                    <></>
                  ) : (
                    setNames.map((val, t) => {
                      return (
                        <Stat
                          values={data.map((e) => e.value)}
                          key={t}
                          statName={t}
                        />
                      );
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
                      startDate={startDate}
                      variation={radioValue === 1 ? "WEEKLY" : "MONTHLY"}
                      selectedEntry={viewingEntry}
                      onSelectEntry={(entry: Happiness[]) => {
                        if (
                          viewingEntry &&
                          viewingEntry[0].id === entry[0].id
                        ) {
                          window.HSOverlay.open(
                            document.querySelector("#group-happiness-modal"),
                          );
                        } else {
                          setViewingEntry(entry);
                        }
                      }}
                      groupId={groupData.id}
                    />
                  </div>
                )}
              </div>
              {viewingEntry && (
                // add group modal here
                <GroupHappinessModal
                  setEntry={setSingleEntry}
                  entries={viewingEntry}
                  id="group-happiness-modal"
                />
              )}
              {singleEntry && (
                <HappinessViewerModal
                  happiness={singleEntry}
                  id="single-happiness-modal"
                  onBackButtonPress={() =>
                    window.HSOverlay.open(
                      document.querySelector("#group-happiness-modal"),
                    )
                  }
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
