import { useEffect, useRef, useState } from "react";
import { useIsMutating, useQuery, useQueryClient } from "react-query";
import Graph from "../../components/Graph";
import { useApi } from "../../contexts/ApiProvider";
import { QueryKeys } from "../../constants";
import { Happiness } from "../../data/models/Happiness";
import { formatDate } from "../../utils";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";

/**
 * The page for displaying entries with the scrollable calendar
 */
export default function Statistics() {
  const { api } = useApi();
  const queryClient = useQueryClient();
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
          start: formatDate(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() - 7,
            ),
          ),
          end: formatDate(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
          ),
        })
        .then((res) => res.data),
  });
  return (
    <>
      <div className="mx-[32px] my-[96px]">
        <Row>
          <div className="mb-4 text-4xl font-medium">Your Stats</div>
        </Row>
        {isError || isLoading || data === undefined ? (
          <></>
        ) : (
          <div className="h-[600px] w-[800px]">
            <Graph entries={data} />
          </div>
        )}
      </div>
    </>
  );
}
