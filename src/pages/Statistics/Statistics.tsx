import { useEffect, useRef, useState } from "react";
import { useIsMutating, useQuery, useQueryClient } from "react-query";
import Graph from "../../components/Graph";
import { useApi } from "../../contexts/ApiProvider";
import { QueryKeys } from "../../constants";
import { Happiness } from "../../data/models/Happiness";
import { formatDate } from "../../utils";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import DateRangeSwitcher from "../../components/DateRangeSwitcher";

/**
 * The page for displaying statistics for the current user
 */
export default function Statistics() {
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [radioValue, setRadioValue] = useState(1);
  const [graphName, setGraphName] = useState("Weekly Happiness");
  const [start, setStart] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7,
    ),
  );
  const [end, setEnd] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  );

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
          start: formatDate(start),
          end: formatDate(end),
        })
        .then((res) => res.data),
  });

  // Changes selected date range between current week and current month when radioValue variable changes.
  useEffect(() => {
    setStart(() => {
      if (radioValue === 1) {
        return new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - new Date().getDay(),
        );
      } else {
        return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      }
    });
    setEnd(() => {
      if (radioValue === 1) {
        return new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - new Date().getDay() + 6,
        );
      } else {
        return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      }
    });
    setGraphName(() =>
      radioValue === 1 ? "Weekly Happiness" : "Monthly Happiness",
    );
  }, [radioValue]);

  // react to changes in data
  useEffect(() => {
    refetch();
  }, [data, start, end, graphName]);

  console.log(graphName);

  return (
    <>
      <div className="mx-[32px] my-[96px]">
        <Row className="pb-4">
          <div className="text-4xl font-medium">Your Stats</div>
          <div className="flex flex-1" />
          <DateRangeSwitcher
            radioValue={radioValue}
            setRadioValue={setRadioValue}
            dates={[start, end]}
            setCurDates={[setStart, setEnd]}
          />
        </Row>
        {isError || isLoading || data === undefined ? (
          <></>
        ) : (
          <div className="h-[600px] w-3/5">
            <Graph entries={data} label={graphName} />
          </div>
        )}
      </div>
    </>
  );
}
