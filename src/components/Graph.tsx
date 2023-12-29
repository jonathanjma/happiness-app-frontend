import LineChart from "./LineChart";
import { User } from "../data/models/User";
import { Happiness } from "../data/models/Happiness";
import { ChartConfiguration, ChartDataset } from "chart.js";
import { Chart, ChartData, registerables } from "chart.js";
Chart.register(...registerables);

/**
 * Custom component for displaying graph of happiness values over time
 * @param entires list of happiness entries to be shown in the graph
 * @param graphTitle the title of the graph, displayed above graph
 * @param graphSubTitle the subtitle of the graph, displayed above graph and below graph title
 * @returns
 */

export default function Graph({
  entries,
  graphTitle = "",
  graphSubTitle = "",
}: {
  entries: Happiness[];
  graphTitle?: string;
  graphSubTitle?: string;
}) {
  if (entries.length === 0) {
    console.log("uh oh");
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
  let datesList: string[] = [...new Set(happinessData.map((e) => e.timestamp))];
  // datesList.push("2023-12-17");
  // datesList.push("2023-12-25");
  // datesList.push("2023-11-24");
  datesList.sort((a: string, b: string) => Date.parse(a) - Date.parse(b));
  // console.log(usernameList);
  // console.log(happinessData);
  // console.log(datesList);

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
    pointHitRadius: 15,
  }));
  // formattedValues.push({
  //   label: "Christopher",
  //   lineTension: 0.4,
  //   data: [3, 4, NaN, 4.5, 7, NaN, 10],
  //   color: "blue",
  // });

  // chartData is the object passed to the LineChart component to create the graph. It contains...
  // labels: list of names for each x-axis value
  // datasets: list of data elements for graph
  const chartData: ChartData<"line", number[], string> = {
    labels: datesList.map((dateString) =>
      dateString.substring(5).replace("-", "/"),
    ),
    datasets: formattedValues,
  };
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="@lg:min-h-[500px] mb-4 flex min-h-[380px] w-full max-w-[1000px] flex-wrap justify-center rounded-[10px] bg-brand_off_white py-8 shadow-lg">
          <h4 className="flex w-full justify-center text-black">
            {graphTitle}
          </h4>
          <h5 className="flex w-full justify-center text-gray-400">
            {graphSubTitle}
          </h5>
          <div className="@lg:min-h-[400px] mx-2 flex max-h-[285px] min-h-[285px] w-full justify-center">
            <LineChart chartData={chartData} />
          </div>
        </div>
      </div>
    </>
  );
}
