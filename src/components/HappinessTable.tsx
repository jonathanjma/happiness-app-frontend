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
export default function HappinessTable({ group, startDate, endDate = formatDate(new Date()) }: {
  group: Group;
  startDate: string,
  endDate?: string;
}) {
  const { api } = useApi();
  const [selectedHappiness, setSelectedHappiness] = useState<Happiness | undefined>(undefined);

  const start = parseYYYYmmddFormat(startDate);
  const end = endDate ? parseYYYYmmddFormat(endDate) : new Date();

  const dateList: Date[] = [];
  const tempStart = new Date(start);
  while (tempStart <= end) {
    dateList.push(new Date(tempStart));
    tempStart.setDate(tempStart.getDate() + 1);
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, {
      start: startDate,
      end: endDate,
      id: group.id
    }],
    queryFn: () => api.get<Happiness[]>(`/group/${group.id}/happiness`, {
      start: startDate,
      end: endDate,
    }).then((res) => res.data)
  });

  if (isLoading) {
    return <span className="flex flex-1 bg-gray-300 rounded-md mt-8 mx-8 animate-pulse h-1/2" />;
  }
  if (isError) {
    return <p className="text-error mt-8 ml-8">Error loading happiness data</p>;
  }


  return (
    <>
      {selectedHappiness &&
        <HappinessViewerModal
          happiness={selectedHappiness}
          id="view-happiness"
        />
      }
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 text-center">
              {start.toLocaleDateString("en-us", { month: "long" })}
            </th>
            {dateList.map((date) =>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                {date.toLocaleDateString("en-us", { weekday: "short" })}
              </th>
            )}
          </tr>
          <tr>
            <th className="border-r border-gray-200"></th>
            {dateList.map((date) =>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                {date.toLocaleDateString("en-us", { day: "numeric" })}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {group.users.map((user) =>
            <tr className="hover:bg-light_yellow">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                {user.username}
              </td>
              {dateList.map((date) => {
                const happiness = data?.find(
                  (happiness) => happiness.timestamp === formatDate(date)
                    && happiness.author.username === user.username
                );
                return <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 text-center ${happiness ? "hover:cursor-pointer" : ""}`}
                  onClick={() => {
                    console.log(`clicked`);
                    setSelectedHappiness(happiness);
                    // @ts-ignore
                    window.HSOverlay.open(document.querySelector("#view-happiness"));
                  }}
                >
                  {happiness?.value}
                </td>;
              })}
            </tr>
          )}
        </tbody>
      </table>
    </>

  );
}
