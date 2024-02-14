import { useApi } from "../../contexts/ApiProvider";
import React, { useEffect, useMemo } from "react";
import { Happiness } from "../../data/models/Happiness";
import { QueryKeys } from "../../constants";
import Spinner from "../../components/Spinner";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import Stat from "../Statistics/Stat";
import Graph from "../../components/Graph";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider";
import { useQuery } from "react-query";
import { useState } from "react";
import { formatDate } from "../../utils";
import DateArrow from "../../components/DateArrow";

export default function GraphPanel({
  userId,
  selectedEntry,
  setEntry,
}: {
  userId: number;
  selectedEntry: Happiness | undefined;
  setEntry: React.Dispatch<React.SetStateAction<Happiness | undefined>>;
}) {
  const { api } = useApi();
  const { user } = useUser();
  const navigate = useNavigate();

  const [start, setStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [end, setEnd] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );

  const [graphSubTitle, setGraphSubTitle] = useState("");

  const statNames = ["Show Average", "Show Median"];

  useEffect(() => {
    if (selectedEntry) {
      window.HSOverlay.open(document.querySelector("#happiness-viewer"));
    }
  }, [selectedEntry]);

  // infinite query for fetching happiness
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
    queryKey: [
      QueryKeys.FETCH_HAPPINESS,
      " graph query",
      { start: start },
      { end: end },
    ],
    queryFn: () =>
      api
        .get("/happiness/", {
          id: userId,
          start: formatDate(start),
          end: formatDate(end),
        })
        .then((res) => res.data),
  });

  // change subtitle when data changes
  useEffect(() => {
    setGraphSubTitle(
      () =>
        start.toLocaleString("default", { month: "long" }) +
        " " +
        start.getFullYear(),
    );
  }, [data]);

  return (
    <div className="scroll-hidden h-full overflow-auto py-4">
      {isLoading ? (
        <Spinner className="ml-8" />
      ) : (
        <>
          {isError ? (
            <p className="text-gray-400">Error: Could not load data.</p>
          ) : (
            <>
              {data === undefined ? (
                <p className="text-gray-400">No data for selected period.</p>
              ) : (
                <div className="mx-8">
                  <Row className="mb-4 w-full space-x-1">
                    <div className="flex flex-1" />
                    <DateArrow
                      dates={[start, end]}
                      setCurDates={[setStart, setEnd]}
                      change={1}
                      variation={"MONTHLY"}
                    />
                    <DateArrow
                      dates={[start, end]}
                      setCurDates={[setStart, setEnd]}
                      change={-1}
                      variation={"MONTHLY"}
                    />
                  </Row>
                  <Column>
                    <Graph
                      entries={data}
                      graphTitle="Monthly Happiness"
                      graphSubTitle={graphSubTitle}
                      range={[start, end]}
                      onSelectEntry={(entry: Happiness[]) => {
                        if (selectedEntry && selectedEntry.id === entry[0].id) {
                          window.HSOverlay.open(
                            document.querySelector("#happiness-viewer"),
                          );
                        } else {
                          setEntry(entry[0]);
                        }
                      }}
                    />
                    <Row className="my-4 flex justify-center space-x-8">
                      {data.length === 0 ? (
                        <></>
                      ) : (
                        statNames.map((val, t) => {
                          if (val) {
                            return (
                              <Stat
                                values={data.map((e) => e.value)}
                                key={t}
                                statName={t}
                                profileVariant={true}
                              />
                            );
                          }
                        })
                      )}
                    </Row>
                  </Column>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
