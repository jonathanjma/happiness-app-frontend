import { useState } from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Group } from "../data/models/Group";
import { Happiness } from "../data/models/Happiness";
import { formatDate, parseYYYYmmddFormat } from "../utils";
import HappinessViewerModal from "./modals/HappinessViewerModal";
/**
 *
 * @param startDate a string in the YYYY-MM-DD format representing the start of
 * the happiness date range
 * @param endDate a string in the YYYY-MM-DD format representing the end of
 * the happiness date range (defaults to today if unspecified)
 * @param groupId the associated group ID for the happiness table
 * @returns
 */
export default function HappinessTable({
  group,
  startDate,
  endDate = formatDate(new Date()),
}: {
  group: Group;
  startDate: string;
  endDate?: string;
}) {
  const { api } = useApi();
  const [selectedHappiness, setSelectedHappiness] = useState<
    Happiness | undefined
  >(undefined);

  const start = parseYYYYmmddFormat(startDate);
  const end = endDate ? parseYYYYmmddFormat(endDate) : new Date();

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
        start: startDate,
        end: endDate,
        id: group.id,
      },
    ],
    queryFn: () =>
      api
        .get<Happiness[]>(`/group/${group.id}/happiness`, {
          start: startDate,
          end: endDate,
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

  return (
    <>
      {selectedHappiness && (
        <HappinessViewerModal
          happiness={selectedHappiness}
          id="view-happiness"
        />
      )}
      <table className="min-w-full divide-x-1 divide-y divide-secondary">
        <thead className="border-1 border-gray-200 bg-gray-50">
          <tr>
            <th className="text-gray-500 border-r border-gray-200 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
              {start.toLocaleDateString("en-us", { month: "long" })}
            </th>
            {dateList.map((date) => (
              <th className="text-gray-500 border-r border-gray-200 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                {date.toLocaleDateString("en-us", { weekday: "short" })}
              </th>
            ))}
          </tr>
          <tr>
            <th className="border-r border-gray-200"></th>
            {dateList.map((date) => (
              <th className="text-gray-500 border-r border-gray-200 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                {date.toLocaleDateString("en-us", { day: "numeric" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-x-1 divide-y-1 divide-gray-200 border-b bg-white">
          {group.users.map((user) => (
            <tr className="hover:bg-light_yellow">
              <td className="text-gray-900 whitespace-nowrap border-l border-r border-gray-200 px-6 py-4 text-sm font-medium">
                {user.username}
              </td>
              {dateList.map((date) => {
                const happiness = data?.find(
                  (happiness) =>
                    happiness.timestamp === formatDate(date) &&
                    happiness.author.username === user.username,
                );
                let dataStyle =
                  "px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 text-center ";
                if (happiness) {
                  dataStyle += "hover:cursor-pointer hover:bg-yellow ";
                  if (happiness.comment) {
                    dataStyle += " has_comment";
                  }
                }
                return (
                  <td
                    className={dataStyle}
                    onClick={() => {
                      // @ts-ignore
                      window.HSOverlay.open(
                        document.querySelector("#view-happiness"),
                      );
                    }}
                    onMouseEnter={() => {
                      setSelectedHappiness(happiness);
                    }}
                  >
                    {happiness?.value}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-b border-solid hover:bg-light_yellow">
            <td className="text-gray-900 whitespace-nowrap border-b border-l border-r border-t-2 border-b-gray-200 border-l-gray-200 border-r-gray-200 border-t-gray-400 px-6 py-4 text-sm font-medium">
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
