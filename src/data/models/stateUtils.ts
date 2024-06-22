import { QueryClient } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessPaginationResults } from "./Happiness";

export function addNewHappiness(
  queryClient: QueryClient,
  happiness: Happiness,
) {
  queryClient.setQueriesData(
    [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
    (data: HappinessPaginationResults | undefined) => {
      return {
        pages:
          data?.pages?.map((happinessPagination) => {
            return {
              ...happinessPagination,
              data: updateArray(
                happinessPagination.data,
                happiness,
                (h1, h2) => h1.timestamp === h2.timestamp,
              ),
            };
          }) ?? [],
        pageParams: data?.pageParams,
      };
    },
  );
  queryClient.setQueriesData(
    [QueryKeys.FETCH_HAPPINESS + " sidebar query"],
    (data: Happiness[] | undefined) => {
      if (data) {
        return updateArray(
          data,
          happiness,
          (h1, h2) => h1.timestamp === h2.timestamp,
        );
      }
      return [];
    },
  );
}

function updateArray<T>(
  array: T[],
  element: T,
  predicate: (a: T, b: T) => boolean,
): T[] {
  const index = array.findIndex((item) => predicate(item, element));
  if (index !== -1) {
    // If an instance matching the predicate is found, replace it
    return array.map((item, i) => (i === index ? element : item));
  } else {
    // If no matching instance is found, add the element
    return [...array, element];
  }
}
