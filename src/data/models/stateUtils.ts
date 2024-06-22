import { QueryClient } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessPaginationResults } from "./Happiness";

export function storeHappinessId(
  queryClient: QueryClient,
  happinessId: number,
  timestamp: string,
) {
  queryClient.setQueriesData(
    [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
    (data: HappinessPaginationResults | undefined) => {
      return {
        pages:
          data?.pages?.map((happinessPagination) => {
            return {
              ...happinessPagination,
              data: happinessPagination.data.map((mHappiness) =>
                mHappiness.timestamp === timestamp
                  ? { ...mHappiness, id: happinessId }
                  : mHappiness,
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
        return [
          ...data.map((mHappiness) =>
            mHappiness.timestamp === timestamp
              ? { ...mHappiness, id: happinessId }
              : mHappiness,
          ),
        ];
      }
      return [];
    },
  );
}
export function storeHappinessNumber(
  queryClient: QueryClient,
  value: number,
  timestamp: string,
) {
  queryClient.setQueriesData(
    [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
    (data: HappinessPaginationResults | undefined) => {
      return {
        pages:
          data?.pages?.map((happinessPagination) => {
            return {
              ...happinessPagination,
              data: happinessPagination.data.map((mHappiness) =>
                mHappiness.timestamp === timestamp
                  ? { ...mHappiness, value: value }
                  : mHappiness,
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
        return [
          ...data.map((mHappiness) =>
            mHappiness.timestamp === timestamp
              ? { ...mHappiness, value: value }
              : mHappiness,
          ),
        ];
      }
      return [];
    },
  );
}
export function storeHappinessComment(
  queryClient: QueryClient,
  comment: string,
  timestamp: string,
) {
  queryClient.setQueriesData(
    [QueryKeys.FETCH_HAPPINESS, QueryKeys.INFINITE],
    (data: HappinessPaginationResults | undefined) => {
      return {
        pages:
          data?.pages?.map((happinessPagination) => {
            return {
              ...happinessPagination,
              data: happinessPagination.data.map((mHappiness) =>
                mHappiness.timestamp === timestamp
                  ? { ...mHappiness, comment: comment }
                  : mHappiness,
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
        return [
          ...data.map((mHappiness) =>
            mHappiness.timestamp === timestamp
              ? { ...mHappiness, comment: comment }
              : mHappiness,
          ),
        ];
      }
      return [];
    },
  );
}
