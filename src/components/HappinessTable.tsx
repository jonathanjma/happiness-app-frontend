import { useQuery } from "react-query";
import { QueryKeys } from "../constants";
import { useApi } from "../contexts/ApiProvider";
import { Happiness } from "../data/models/Happiness";
import { formatDate } from "../utils";
/**
 * 
 * @param startDate a string in the YYYY-MM-DD format representing the start of 
 * the happiness date range
 * @param endDate a string in the YYYY-MM-DD format representing the end of 
 * the happiness date range (defaults to today if unspecified)
 * @param groupId the associated group ID for the happiness table
 * @returns  
 */
export default function HappinessTable({ groupId, startDate, endDate = formatDate(new Date()) }: {
  groupId: number;
  startDate: string,
  endDate?: string;
}) {
  const { api } = useApi();

  const groupHappiness = useQuery({
    queryKey: [QueryKeys.FETCH_GROUP_HAPPINESS, {
      start: startDate,
      end: endDate,
      id: groupId
    }],
    queryFn: () => api.get<Happiness[]>(`/group/${groupId}/happiness`, {
      start: startDate,
      end: endDate,
    }).then((res) => res.data)
  });

  if (groupHappiness.isLoading) {
    return <span className="flex flex-1 bg-gray-300 rounded-md mt-8 mx-8 animate-pulse h-1/2" />;
  }
  if (groupHappiness.isError) {
    return <p className="text-error mt-8 ml-8">Error loading happiness data</p>;
  }

  return (
    <table className="table-auto border-collapse">
      <thead>

      </thead>
      <tr className="border-gray-600 border-1">
        test
      </tr>
      <td className="border-gray-600 border-1">
        hi
      </td>
      <td className="border-gray-600 border-1">
        2
      </td>
      <td className="border-gray-600 border-1">
        2
      </td>
      <td className="border-gray-600 border-1">
        2
      </td>
      <td className="border-gray-600 border-1">
        2
      </td>
    </table>
  );
}
