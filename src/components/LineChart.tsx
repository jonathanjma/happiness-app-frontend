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

/**
 * Creates LineChart used in Graph component
 * @param chartData formatted data used to create LineChart (see react-chartjs-2 for more info)
 * @param onClick function that provides side effects when points are clicked
 * @returns
 */

export default function LineChart({
  chartData,
  onClick,
}: {
  chartData: ChartData<"line", number[], string>;
  onClick: (evt: ChartEvent, element: ActiveElement[]) => void;
}) {
  return (
    <div className="container">
      <Line
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
