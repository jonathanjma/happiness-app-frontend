import React, { useEffect, useRef } from "react";
// don't delete below import!
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Happiness } from "../data/models/Happiness";
import { ChartData } from "chart.js";
import { ChartType } from "chart.js";
import { ChartEvent } from "chart.js/dist/core/core.plugins";
import { getElementAtEvent } from "react-chartjs-2";
import { ActiveElement } from "chart.js/dist/plugins/plugin.tooltip";

export default function LineChart({
  chartData,
  onClick,
}: {
  chartData: ChartData<"line", number[], string>;
  onClick: (evt: ChartEvent, element: ActiveElement[]) => void;
}) {
  // const chartRef = useRef(null);

  //   useEffect(() => {
  //     const chart = chartRef.current;

  //     if (chart) {
  //       console.log("ChartJS", chart);
  //       // @ts-ignore
  //       console.log(chart.chartInstance);
  //     }
  //   }, []);

  // function change_data(element) {
  //     if (element.length > 0) {
  //       let index = element[0].index;
  //       let dataindices = element.map((e) => e.datasetIndex);
  //       setPointData([dataindices, index]);
  //       dayShow(true);
  //   }
  // }

  return (
    <div className="container">
      <Line
        // ref={chartRef}
        redraw={true}
        updateMode="show"
        data={chartData}
        options={{
          animation: {
            duration: 0,
          },
          onClick: onClick,
          responsive: true,
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
