import LineChart from "./LineChart";
import { Happiness } from "../data/models/Happiness";
import { ScriptableLineSegmentContext } from "chart.js";
import { Chart, ChartData, registerables } from "chart.js";
import { parseYYYYmmddFormat, getDaysArray } from "../utils";
import { ChartEvent } from "chart.js/dist/core/core.plugins";
import { ActiveElement } from "chart.js/dist/plugins/plugin.tooltip";
Chart.register(...registerables);

/**
 * Custom component for displaying graph of happiness values over time
 * @param entries list of happiness entries to be shown in the graph
 * @param graphTitle the title of the graph, displayed above graph
 * @param graphSubTitle the subtitle of the graph, displayed above graph and below graph title
 * @param showDay boolean determining whether to show day of week as label instead of date
 * @param uniqDays if true, shows only the days with happiness entered over all users, otherwise shows all dates in given range
 * @param range two-element list containing the start and end date objects for the graph (required if uniqDays = false
 * @param onSelectEntry function describing what happens when a specific list of happiness values is clicked
 * @returns
 */

export default function Graph({
  entries,
  graphTitle = "",
  graphSubTitle = "",
  showDay = false,
  uniqDays = true,
  range,
  onSelectEntry,
}: {
  entries: Happiness[];
  graphTitle?: string;
  graphSubTitle?: string;
  showDay?: boolean;
  uniqDays?: boolean;
  range: Date[];
  onSelectEntry: (selectedEntry: Happiness[]) => void;
}) {
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
  usernameList.sort();

  // define happiness data, which is then sorted by chronological order
  let happinessData: Happiness[] = entries;
  happinessData.sort(
    (a: Happiness, b: Happiness) =>
      Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

  let datesList: string[] = uniqDays
    ? getDaysArray(range[0], range[1])
    : [...new Set(happinessData.map((e) => e.timestamp))];
  datesList.sort((a: string, b: string) => Date.parse(a) - Date.parse(b));

  // graph label; converts to day of week if showDay is true, otherwise shows date as graph label
  const graphLabels: string[] = showDay
    ? datesList.map((d: string) =>
        parseYYYYmmddFormat(d).toLocaleString("en-us", { weekday: "short" }),
      )
    : datesList.map((dateString) => dateString.substring(5).replace("-", "/"));

  // allows gaps between values to be filled by a dashed line
  const skipped = (ctx: ScriptableLineSegmentContext, value: number[]) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;

  // formattedValues is a list of objects that represent the dataset for the graph
  const formattedValues = usernameList.map((name, idx) => ({
    label: name,
    lineTension: 0.4,
    data: datesList.map((date) => {
      const filtered = entries.filter(
        (entry) => entry.timestamp === date && entry.author.username === name,
      );
      return filtered.length === 1 ? filtered[0].value : NaN;
    }),
    borderColor: colors[idx % colors.length],
    segment: {
      borderDash: (ctx: ScriptableLineSegmentContext) => skipped(ctx, [6, 6]),
    },
    spanGaps: true,
    pointHitRadius: 15,
  }));

  const onClick = (evt: ChartEvent, elts: ActiveElement[]) => {
    if (elts[0].index === undefined) return;
    const foundEntries: Happiness[] = [];
    elts.map((elt) => {
      let foundEntry = entries.find(
        (h) =>
          h.timestamp === datesList[elt.index] &&
          h.author.username === usernameList[elt.datasetIndex],
      );
      if (foundEntry) {
        foundEntries.push(foundEntry);
      }
    });
    onSelectEntry(foundEntries);
  };

  // chartData is the object passed to the LineChart component to create the graph. It contains...
  // labels: list of names for each x-axis value
  // datasets: list of data elements for graph
  const chartData: ChartData<"line", number[], string> = {
    labels: graphLabels,
    datasets: formattedValues,
  };
  return (
    <>
      <div className="flex w-full flex-1 justify-center">
        <div className="@lg:min-h-[500px] mb-4 flex min-h-[380px] w-full flex-1 flex-wrap justify-center rounded-[10px] bg-brand_off_white py-8 shadow-lg">
          <h4 className="text-black flex justify-center">{graphTitle}</h4>
          <h5 className="flex w-full justify-center text-gray-400">
            {graphSubTitle}
          </h5>
          <div className="@lg:min-h-[400px] mx-2 flex max-h-[285px] min-h-[285px] w-full justify-center">
            {entries.length === 0 ? (
              <div className="flex items-center">
                No data for selected period.
              </div>
            ) : (
              <div className="flex flex-1">
                <LineChart chartData={chartData} onClick={onClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
