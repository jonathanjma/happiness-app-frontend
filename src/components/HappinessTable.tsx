import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Group } from "../data/models/Group";
import { Happiness } from "../data/models/Happiness";
import { formatDate, parseYYYYmmddFormat } from "../utils";
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
    <table className="table-auto border-collapse border-secondary rounded-md">
      <thead>
        {/* Month header */}
        <tr>
          <th></th>
          <th>
            {start.toLocaleDateString("en-us", { month: "long" })}
          </th>
        </tr>
        {/* Weekdays */}
        <tr>
          <th></th>
          {dateList.map((date) =>
            <th>{date.toLocaleDateString("en-us", { weekday: "short" })}</th>
          )}
        </tr>
        {/* Numeric days */}
        <tr>
          <th></th>
          {dateList.map((date) =>
            <th>{date.toLocaleDateString("en-us", { day: "numeric" })}</th>
          )}
        </tr>
      </thead>
      {/* Group data */}
      {group.users.map((user) =>
        <tr>
          <td>{user.username}</td>
          {dateList.map((date) =>
            <td>
              {data?.find(
                (happiness) => happiness.timestamp === formatDate(date)
                  && happiness.author.username === user.username
              )?.value ??
                "NA"}
            </td>
          )}
        </tr>
      )}
    </table>
  );
}
