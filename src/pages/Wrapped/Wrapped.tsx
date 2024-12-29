import Card from "../../components/Card";
import Graph from "../../components/Graph";
import { useQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness } from "../../data/models/Happiness";
import { useApi } from "../../contexts/ApiProvider";
import { formatDate } from "../../utils";
import Spinner from "../../components/Spinner";
import React, { useEffect, useState } from "react";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";

export default function Wrapped() {
  const data = {
    username: "Alex",
    entries: 356,
    top_pct: 0.0625,
    average_score: 6.640449438202247,
    mode_score: { score: 6.5, count: 61 },
    longest_streak: {
      start: "2024-01-01T00:00:00",
      end: "2024-12-21T00:00:00",
      days: 355,
    },
    min_score: { score: 2.5, date: "2024-05-15T00:00:00" },
    max_score: { score: 9.0, date: "2024-12-17T00:00:00" },
    largest_diff: {
      start: "2024-08-21T00:00:00",
      end: "2024-08-22T00:00:00",
      diff: "+5.0",
    },
    month_highest: { month: 12, avg_score: 7.071428571428571 },
    month_lowest: { month: 5, avg_score: 5.806451612903226 },
    week_highest: { week_start: "2024-12-16T00:00:00", avg_score: 8.0 },
    week_lowest: {
      week_start: "2024-05-13T00:00:00",
      avg_score: 4.357142857142857,
    },
    top_words: [
      "went,331",
      "got,256",
      "pretty,195",
      "took,177",
      "work,145",
      "walked,142",
      "around,136",
      "nice,133",
      "bit,132",
      "day,120",
    ],
  };

  const formatDateWrapped = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  // for top words scaling
  const maxFontSize = 24; // px
  const minFontSize = 12; // px
  const maxOccurrences = parseInt(data.top_words[0].split(",")[1]);
  const minOccurrences = parseInt(
    data.top_words[data.top_words.length - 1].split(",")[1],
  );
  const calculateFontSize = (count: number) => {
    return (
      ((count - minOccurrences) / (maxOccurrences - minOccurrences)) *
        (maxFontSize - minFontSize) +
      minFontSize
    ).toFixed(2);
  };

  const { api } = useApi();
  const {
    isLoading,
    data: graphData,
    isError,
  } = useQuery<Happiness[]>([QueryKeys.FETCH_HAPPINESS, "wrapped year"], () =>
    api
      .get<Happiness[]>("/happiness/", {
        start: formatDate(new Date("2024-01")),
        end: formatDate(new Date("2025-01")),
      })
      .then((res) => res.data),
  );

  const [selectedEntry, setSelectedEntry] = useState<Happiness>();
  useEffect(() => {
    if (selectedEntry) {
      window.HSOverlay.open(
        document.querySelector("#wrapped-happiness-viewer"),
      );
    }
  }, [selectedEntry]);

  const [dateQuery, setDateQuery] = useState<string[]>(["", ""]);
  const {} = useQuery<Happiness[]>(
    [QueryKeys.FETCH_HAPPINESS, "wrapped", dateQuery],
    () =>
      api
        .get<Happiness[]>("/happiness/", {
          start: formatDate(new Date(dateQuery[0])),
          end: formatDate(new Date(dateQuery[0])),
        })
        .then((res) => {
          setSelectedEntry(res.data[0]);
          return res.data;
        }),
    { enabled: dateQuery[0] !== "" },
  );

  return (
    <div className="px-6 py-10 text-gray-800">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {data.username}'s Happiness App Wrapped 2024
      </h1>
      <div className="grid grid-cols-1 gap-6 rounded-lg  py-6 md:grid-cols-2 ">
        <Card className="border-yellow bg-light_yellow p-6">
          <h2 className="text-xl font-semibold">General Stats</h2>
          <ul className="mt-2 space-y-1.5">
            <li>
              You made <strong>{data.entries} entries</strong> this year 📝
            </li>
            <li>
              This puts you in the{" "}
              <strong>top {(data.top_pct * 100).toFixed(1)}%</strong> of all
              active users!
            </li>
            <li>
              Your <strong>average</strong> happiness score was{" "}
              {data.average_score.toFixed(2)}
            </li>
            <li>
              And you ranked your day a {data.mode_score.score} the{" "}
              <strong>most often</strong>, {data.mode_score.count} times
            </li>
          </ul>
        </Card>

        <Card className="border-yellow bg-light_yellow p-6">
          <h2 className="text-xl font-semibold">Streaks and Extremes</h2>
          <ul className="mt-2 space-y-1.5">
            <li>
              Your <strong>longest logging streak</strong> lasted{" "}
              {data.longest_streak.days} days, from{" "}
              {formatDateWrapped(data.longest_streak.start)} to{" "}
              {formatDateWrapped(data.longest_streak.end)}!
            </li>
            <li>
              You felt the <strong>saddest</strong> on{" "}
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view date"
                onClick={() =>
                  // Math.random() needed to force react query fetch every time
                  setDateQuery([data.min_score.date, Math.random().toString()])
                }
              >
                {formatDateWrapped(data.min_score.date)}
              </span>
              , where you ranked your day a {data.min_score.score}
            </li>
            <li>
              But you felt the <strong>happiest</strong> on{" "}
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view date"
                onClick={() =>
                  setDateQuery([data.max_score.date, Math.random().toString()])
                }
              >
                {formatDateWrapped(data.max_score.date)}
              </span>
              , where you ranked your day a {data.max_score.score}
            </li>
            <li>
              And{" "}
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view date"
                onClick={() =>
                  setDateQuery([
                    data.largest_diff.end,
                    Math.random().toString(),
                  ])
                }
              >
                {formatDateWrapped(data.largest_diff.end)}
              </span>{" "}
              was your <strong>largest jump</strong> in happiness score, which
              changed by {data.largest_diff.diff}
            </li>
          </ul>
        </Card>

        <Card className="border-yellow bg-light_yellow p-6">
          <h2 className="text-xl font-semibold">Monthly and Weekly Trends</h2>
          <ul className="mt-2 space-y-1.5">
            <li>
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view entries"
                onClick={() =>
                  window.open(
                    `/home?date=2024-${data.month_highest.month}-01`,
                    "_blank",
                  )
                }
              >
                {getMonthName(data.month_highest.month)}
              </span>{" "}
              was your <strong>happiest month</strong>, with an average score of{" "}
              {data.month_highest.avg_score.toFixed(2)}
            </li>
            <li>
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view entries"
                onClick={() =>
                  window.open(
                    `/home?date=2024-${data.month_lowest.month}-01`,
                    "_blank",
                  )
                }
              >
                {getMonthName(data.month_lowest.month)}
              </span>{" "}
              was your <strong>saddest month</strong>, with an average score of{" "}
              {data.month_lowest.avg_score.toFixed(2)}
            </li>
            <li>
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view entries"
                onClick={() =>
                  window.open(
                    "/home?date=" + data.week_highest.week_start.split("T")[0],
                    "_blank",
                  )
                }
              >
                {formatDateWrapped(data.week_highest.week_start)}
              </span>{" "}
              was your <strong>happiest week</strong>, with an average score of{" "}
              {data.week_highest.avg_score.toFixed(2)}
            </li>
            <li>
              <span
                className="border-black cursor-pointer border-b border-dotted"
                title="Click to view entries"
                onClick={() =>
                  window.open(
                    "/home?date=" + data.week_lowest.week_start.split("T")[0],
                    "_blank",
                  )
                }
              >
                {formatDateWrapped(data.week_lowest.week_start)}
              </span>{" "}
              was your <strong>saddest week</strong>, with an average score of{" "}
              {data.week_lowest.avg_score.toFixed(2)}
            </li>
          </ul>
        </Card>

        <Card className="border-yellow bg-light_yellow p-6">
          <h2 className="mb-2 text-xl font-semibold">Top Words</h2>
          <span>
            The <strong>top 10</strong> words you used in your entries were:
          </span>
          <div className="flex flex-wrap gap-2">
            {data.top_words.map((wordData, index) => {
              const [word, count] = wordData.split(",");
              return (
                <span
                  key={index}
                  className="leading-9"
                  title={count + " times"}
                  style={{
                    fontSize: `${calculateFontSize(parseInt(count))}px`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </Card>
      </div>
      {isLoading || isError || graphData == undefined ? (
        <Spinner className="ml-8" />
      ) : (
        <Graph
          entries={graphData}
          graphTitle="Your 2024 Happiness Graph"
          range={[new Date(2024, 0, 1), new Date(2025, 0, 1)]}
          onSelectEntry={(entry: Happiness[]) => {
            setSelectedEntry(entry[0]);
          }}
        />
      )}
      {selectedEntry && (
        <HappinessViewerModal
          happiness={selectedEntry}
          id="wrapped-happiness-viewer"
        />
      )}
    </div>
  );
}
