import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Group } from "../data/models/Group";
import { Happiness } from "../data/models/Happiness";
import { floatToColor, formatDate, parseYYYYmmddFormat } from "../utils";
import Row from "./layout/Row";
import HappinessViewerModal from "./modals/HappinessViewerModal";
import DateRangeSwitcher from "./DateRangeSwitcher";
/**
 *
 * @param startDate a string in the YYYY-MM-DD format representing the start of
 * the happiness date range
 * @param endDate a string in the YYYY-MM-DD format representing the end of
 * the happiness date range
 * @param groupId the associated group ID for the happiness table
 * @returns
 */
export default function HappinessTable({
  group,
  radioValue,
  setRadioValue,
  startDate,
  endDate,
  setCurDates,
}: {
  group: Group;
  radioValue: number;
  setRadioValue: (newValue: number) => void;
  startDate: Date;
  endDate: Date;
  setCurDates: ((newValue: Date) => void)[];
}) {
  const { api } = useApi();
  const [selectedHappiness, setSelectedHappiness] = useState<
    Happiness | undefined
  >(undefined);
  // open modal when user selects new happiness
  useEffect(() => {
    if (selectedHappiness) {
      window.HSOverlay.open(document.querySelector("#view-happiness"));
      api.post("/reads/", {
        happiness_id: selectedHappiness.id,
      });
    }
  }, [selectedHappiness]);

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const start = parseYYYYmmddFormat(formattedStartDate);
  const end = parseYYYYmmddFormat(formattedEndDate);

  const dateList: Date[] = [];
  const tempStart = new Date(start);
  while (tempStart <= end) {
    dateList.push(new Date(tempStart));
    tempStart.setDate(tempStart.getDate() + 1);
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      QueryKeys.FETCH_GROUP_HAPPINESS,
      {
        start: formattedStartDate,
        end: formattedEndDate,
        id: group.id,
      },
    ],
    queryFn: () =>
      api
        .get<Happiness[]>(`/group/${group.id}/happiness`, {
          start: formattedStartDate,
          end: formattedEndDate,
        })
        .then((res) => res.data),
  });

  if (isLoading) {
    return (
      <span className="mx-8 mt-8 flex h-1/2 flex-1 animate-pulse rounded-md bg-gray-300" />
    );
  }
  if (isError) {
    return <p className="ml-8 mt-8 text-error">Error loading happiness data</p>;
  }
  const xPadding = dateList.length > 7 ? "px-2" : "px-6";

  return (
    <>
      {selectedHappiness && (
        <HappinessViewerModal
          happiness={selectedHappiness}
          id="view-happiness"
        />
      )}
      <Row className="pb-8">
        <div className="flex flex-1" />
        <DateRangeSwitcher
          radioValue={radioValue}
          setRadioValue={setRadioValue}
          dates={[startDate, endDate]}
          setCurDates={setCurDates}
        />
      </Row>
      <table className="min-w-full border-separate border-spacing-0 divide-x-1 divide-y divide-secondary">
        <thead className="border-1 border-gray-200 bg-gray-50">
          <tr>
            <th
              className={`text-gray-500 sticky left-0 border-r border-gray-200 bg-gray-50 ${xPadding} py-3 text-center text-xs font-medium uppercase tracking-wider`}
            >
              {start.toLocaleDateString("en-us", { month: "long" })}
            </th>
            {dateList.map((date) => (
              <th
                className={`text-gray-500 border-r border-gray-200 ${xPadding} py-3 text-center text-xs font-medium uppercase tracking-wider`}
              >
                {date.toLocaleDateString("en-us", { weekday: "short" })}
              </th>
            ))}
          </tr>
          <tr>
            <th className="sticky left-0 border-b border-r border-gray-200 bg-gray-50"></th>
            {dateList.map((date) => (
              <th className="text-gray-500 border-b border-r border-gray-200 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                {date.toLocaleDateString("en-us", { day: "numeric" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-x-1 divide-y-1 divide-gray-200 border-b bg-white">
          {group.users.map((user) => (
            <tr>
              <td className="text-gray-900 sticky left-0 z-10 whitespace-nowrap border-b border-l border-r border-gray-200 bg-white pl-2 text-sm font-medium">
                <Row className="items-center gap-2">
                  <img
                    src={user.profile_picture}
                    className="h-6 w-6 rounded-full"
                  />

                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "150px", // Adjust this value as needed
                    }}
                  >
                    {user.username}
                  </div>
                </Row>
              </td>
              {dateList.map((date) => {
                const happiness = data?.find(
                  (happiness) =>
                    happiness.timestamp === formatDate(date) &&
                    happiness.author.username === user.username,
                );
                let dataStyle = `whitespace-nowrap text-sm text-gray-500 border-r border-b border-gray-200 text-center py-4 ${xPadding} `;
                if (happiness) {
                  dataStyle += "hover:cursor-pointer ";
                  if (happiness.comment) {
                    dataStyle += "has_comment ";
                  }
                }
                return (
                  <td
                    className={dataStyle}
                    onClick={() => {
                      if (
                        selectedHappiness &&
                        selectedHappiness.id === happiness?.id
                      ) {
                        window.HSOverlay.open(
                          document.querySelector("#view-happiness"),
                        );
                      } else {
                        setSelectedHappiness(happiness);
                      }
                    }}
                    style={{
                      backgroundColor: floatToColor(happiness?.value ?? -1),
                    }}
                  >
                    {happiness?.value}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-b border-solid">
            <td className="text-gray-900 sticky left-0 whitespace-nowrap border-b border-l border-r border-t-2 border-b-gray-200 border-l-gray-200 border-r-gray-200 border-t-gray-400 bg-white px-6 py-4 text-sm font-medium">
              Average
            </td>
            {dateList.map((date) => {
              const happinessValuesForDate = data!
                .filter((happiness) => happiness.timestamp === formatDate(date))
                .map((happiness) => happiness.value);
              const averageHappiness =
                happinessValuesForDate.length === 0
                  ? "N/A"
                  : (
                      happinessValuesForDate.reduce(
                        (prev, current) => prev + current,
                      ) / happinessValuesForDate.length
                    ).toString();
              return (
                <td className="text-gray-500 whitespace-nowrap border-b border-r border-t-2 border-b-gray-200 border-r-gray-200 border-t-gray-400 px-6 py-4 text-center text-sm">
                  {isNaN(parseFloat(averageHappiness))
                    ? averageHappiness
                    : parseFloat(averageHappiness).toFixed(1)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
