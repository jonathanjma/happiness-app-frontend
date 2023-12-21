import React from "react";
// don't delete below import!
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Happiness } from "../data/models/Happiness";
import { ChartData } from "chart.js";
import { ChartType } from "chart.js";

export default function LineChart({
  chartData,
}: {
  chartData: ChartData<"line", number[], string>;
}) {
  // function change_data(element) {
  //     if (element.length > 0) {
  //       let index = element[0].index;
  //       let dataindices = element.map((e) => e.datasetIndex);
  //       setPointData([dataindices, index]);
  //       dayShow(true);
  //   }
  // }

  return (
    <div className="container flex w-full">
      <Line
        data={chartData}
        options={{
          // onClick: (evt, element) => {
          //   change_data(element);
          // },
          maintainAspectRatio: false,
          plugins: {
            colors: {
              enabled: false,
            },
            legend: {
              display: chartData.datasets.length > 1,
              labels: {
                boxWidth: 15,
              },
            },
          },
          scales: {
            y: {
              max: 10,
              min: 0,
            },
          },
          layout: {
            padding: {},
          },
        }}
      />
    </div>
  );
}
