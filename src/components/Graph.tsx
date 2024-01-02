import LineChart from "./LineChart";
import { User } from "../data/models/User";
import { Happiness } from "../data/models/Happiness";
import {
  ChartConfiguration,
  ChartDataset,
  RadialLinearScaleOptions,
  ScriptableChartContext,
  ScriptableLineSegmentContext,
  ScriptableTooltipContext,
} from "chart.js";
import { Chart, ChartData, registerables } from "chart.js";
import { formatDate, parseYYYYmmddFormat } from "../utils";
Chart.register(...registerables);

/**
 * Custom component for displaying graph of happiness values over time
 * @param entries list of happiness entries to be shown in the graph
 * @param graphTitle the title of the graph, displayed above graph
 * @param graphSubTitle the subtitle of the graph, displayed above graph and below graph title
 * @param showDay boolean determining whether to show day of week as label instead of date
 * @param uniqDays if true, shows only the days with happiness entered over all users, otherwise shows all dates in given range
 * @param range two-element list containing the start and end date objects for the graph (required if uniqDays = false)
 * @returns
 */

export default function Graph({
  entries,
  graphTitle = "",
  graphSubTitle = "",
  showDay = false,
  uniqDays = true,
  range,
}: {
  entries: Happiness[];
  graphTitle?: string;
  graphSubTitle?: string;
  showDay?: boolean;
  uniqDays?: boolean;
  range: Date[];
}) {
  if (entries.length === 0) {
    console.log("empty entries");
  }
  // define colors for graph
  let colors = [
    "royalblue",
    "crimson",
    "seagreen",
    "slateblue",
    "darkorchid",
    "deeppink",
    "olive",
    "orange",
    "salmon",
    "saddlebrown",
    "navy",
    "pink",
    "turquoise",
    "black",
    "limegreen",
    "mediumvioletred",
    "darkkhaki",
    "darkgray",
    "violet",
    "aquamarine",
    "indigo",
  ];

  // define names
  let usernameList: string[] = [
    ...new Set(entries.map((e) => e.author.username)),
  ];

  // define happiness data, which is then sorted by chronological order
  let happinessData: Happiness[] = entries;
  happinessData.sort(
    (a: Happiness, b: Happiness) =>
      Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

  // helper function to get list of dates given a start and end date
  var getDaysArray = function (s: Date, e: Date) {
    for (
      var a = [], d = new Date(s);
      d <= new Date(e);
      d.setDate(d.getDate() + 1)
    ) {
      a.push(formatDate(new Date(d)));
    }
    return a;
  };

  let datesList: string[] = uniqDays
    ? getDaysArray(range[0], range[1])
    : [...new Set(happinessData.map((e) => e.timestamp))];
  datesList.sort((a: string, b: string) => Date.parse(a) - Date.parse(b));

  // by default, shows date as graph label
  let graphLabels: string[] = datesList.map((dateString) =>
    dateString.substring(5).replace("-", "/"),
  );

  // converts to day of week if showDay is true
  if (showDay) {
    graphLabels = datesList.map((d: string) =>
      parseYYYYmmddFormat(d).toLocaleString("en-us", { weekday: "short" }),
    );
  }

  const skipped = (ctx: ScriptableLineSegmentContext, value: number[]) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;

  // datesList.push("2023-12-17");
  // datesList.push("2023-12-25");
  // datesList.push("2023-11-24");

  // console.log(usernameList);
  // console.log(happinessData);
  // console.log(datesList);

  // console.log(graphLabels);
  // formattedValues is a list of objects that represent the dataset for the graph
  const formattedValues = usernameList.map((name, idx) => ({
    label: name,
    lineTension: 0.4,
    data: datesList.map((date) => {
      // console.log(date);
      // console.log(name);
      // console.log(entries);
      const filtered = entries.filter(
        (entry) => entry.timestamp === date && entry.author.username === name,
      );
      // console.log(filtered);
      return filtered.length === 1 ? filtered[0].value : NaN;
    }),
    borderColor: colors[idx % colors.length],
    segment: {
      borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
    },
    spanGaps: true,
    pointHitRadius: 15,
  }));

  // chartData is the object passed to the LineChart component to create the graph. It contains...
  // labels: list of names for each x-axis value
  // datasets: list of data elements for graph
  const chartData: ChartData<"line", number[], string> = {
    labels: graphLabels,
    datasets: formattedValues,
  };
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="@lg:min-h-[500px] mb-4 flex min-h-[380px] w-full flex-wrap justify-center rounded-[10px] bg-brand_off_white py-8 shadow-lg">
          <h4 className="flex w-full justify-center text-black">
            {graphTitle}
          </h4>
          <h5 className="flex w-full justify-center text-gray-400">
            {graphSubTitle}
          </h5>
          <div className="@lg:min-h-[400px] mx-2 flex max-h-[285px] min-h-[285px] w-full justify-center">
            {entries.length === 0 ? (
              <div className="flex items-center">
                No data for selected period.
              </div>
            ) : (
              <LineChart chartData={chartData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
