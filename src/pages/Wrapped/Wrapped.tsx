import Card from "../../components/Card";
import Graph from "../../components/Graph";
import { useQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessWrapped } from "../../data/models/Happiness";
import { useApi } from "../../contexts/ApiProvider";
import { formatDate } from "../../utils";
import Spinner from "../../components/Spinner";
import React, { useEffect, useState } from "react";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";

export default function Wrapped() {
  const { api } = useApi();
  const {
    isLoading: wrappedIsLoading,
    data: wrappedData,
    isError: wrappedIsError,
  } = useQuery<HappinessWrapped>(["fetch wrapped"], () =>
    api.get<HappinessWrapped>("/happiness/wrapped").then((res) => res.data),
  );

  const formatDateWrapped = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  const calculateFontSize = (count: number, top_words: string[]) => {
    const [minFontSize, maxFontSize] = [12, 24]; // px
    const maxOccurrences = parseInt(top_words[0].split(",")[1]);
    const minOccurrences = parseInt(
      top_words[top_words.length - 1].split(",")[1],
    );
    return (
      ((count - minOccurrences) / (maxOccurrences - minOccurrences)) *
        (maxFontSize - minFontSize) +
      minFontSize
    ).toFixed(2);
  };

  const {
    isLoading: graphIsLoading,
    data: graphData,
    isError: graphIsError,
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
  useQuery<Happiness[]>(
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
      {wrappedIsLoading ? (
        <Spinner className="mb-8 ml-8" text="Loading..." />
      ) : (
        <>
          {wrappedIsError || wrappedData == undefined ? (
            <h5 className="mx-8">
              Unfortunately you didn't post enough entries this year to create a
              wrapped, try to use Happiness App more next year!
            </h5>
          ) : (
            <>
              <h1 className="mb-6 text-center text-3xl font-semibold">
                {wrappedData.username}'s Happiness App Wrapped 2024
              </h1>
              <div className="grid grid-cols-1 gap-6 rounded-lg  py-6 md:grid-cols-2 ">
                <Card className="border-yellow bg-light_yellow p-6">
                  <h2 className="text-xl font-semibold">General Stats</h2>
                  <ul className="mt-2 space-y-1.5">
                    <li>
                      You made <strong>{wrappedData.entries} entries</strong>{" "}
                      this year 📝
                    </li>
                    <li>
                      This puts you in the{" "}
                      <strong>
                        top {(wrappedData.top_pct * 100).toFixed(1)}%
                      </strong>{" "}
                      of all active users!
                    </li>
                    <li>
                      Your <strong>average</strong> happiness score was{" "}
                      {wrappedData.average_score.toFixed(2)}
                    </li>
                    <li>
                      And you ranked your day a {wrappedData.mode_score.score}{" "}
                      the <strong>most often</strong>,{" "}
                      {wrappedData.mode_score.count} times
                    </li>
                  </ul>
                </Card>

                <Card className="border-yellow bg-light_yellow p-6">
                  <h2 className="text-xl font-semibold">
                    Streaks and Extremes
                  </h2>
                  <ul className="mt-2 space-y-1.5">
                    <li>
                      Your <strong>longest logging streak</strong> lasted{" "}
                      {wrappedData.longest_streak.days} days, from{" "}
                      {formatDateWrapped(wrappedData.longest_streak.start)} to{" "}
                      {formatDateWrapped(wrappedData.longest_streak.end)}!
                    </li>
                    <li>
                      You felt the <strong>saddest</strong> on{" "}
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view date"
                        onClick={() =>
                          // Math.random() needed to force react query fetch every time
                          setDateQuery([
                            wrappedData.min_score.date,
                            Math.random().toString(),
                          ])
                        }
                      >
                        {formatDateWrapped(wrappedData.min_score.date)}
                      </span>
                      , ranking your day a {wrappedData.min_score.score}
                    </li>
                    <li>
                      But you felt the <strong>happiest</strong> on{" "}
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view date"
                        onClick={() =>
                          setDateQuery([
                            wrappedData.max_score.date,
                            Math.random().toString(),
                          ])
                        }
                      >
                        {formatDateWrapped(wrappedData.max_score.date)}
                      </span>
                      , ranking your day a {wrappedData.max_score.score}
                    </li>
                    <li>
                      And{" "}
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view date"
                        onClick={() =>
                          setDateQuery([
                            wrappedData.largest_diff.end,
                            Math.random().toString(),
                          ])
                        }
                      >
                        {formatDateWrapped(wrappedData.largest_diff.end)}
                      </span>{" "}
                      was your <strong>largest jump</strong> in happiness score,
                      which changed by {wrappedData.largest_diff.diff}
                    </li>
                  </ul>
                </Card>

                <Card className="border-yellow bg-light_yellow p-6">
                  <h2 className="text-xl font-semibold">
                    Monthly and Weekly Trends
                  </h2>
                  <ul className="mt-2 space-y-1.5">
                    <li>
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view entries"
                        onClick={() =>
                          window.open(
                            "/home?date=" +
                              formatDate(
                                new Date(
                                  2024,
                                  wrappedData.month_highest.month - 1,
                                ),
                              ),
                            "_blank",
                          )
                        }
                      >
                        {getMonthName(wrappedData.month_highest.month)}
                      </span>{" "}
                      was your <strong>happiest month</strong>, with an average
                      score of {wrappedData.month_highest.avg_score.toFixed(2)}
                    </li>
                    <li>
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view entries"
                        onClick={() =>
                          window.open(
                            "/home?date=" +
                              formatDate(
                                new Date(
                                  2024,
                                  wrappedData.month_lowest.month - 1,
                                ),
                              ),
                            "_blank",
                          )
                        }
                      >
                        {getMonthName(wrappedData.month_lowest.month)}
                      </span>{" "}
                      was your <strong>saddest month</strong>, with an average
                      score of {wrappedData.month_lowest.avg_score.toFixed(2)}
                    </li>
                    <li>
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view entries"
                        onClick={() =>
                          window.open(
                            "/home?date=" +
                              wrappedData.week_highest.week_start.split("T")[0],
                            "_blank",
                          )
                        }
                      >
                        {formatDateWrapped(wrappedData.week_highest.week_start)}
                      </span>{" "}
                      was your <strong>happiest week</strong>, with an average
                      score of {wrappedData.week_highest.avg_score.toFixed(2)}
                    </li>
                    <li>
                      <span
                        className="border-black cursor-pointer border-b border-dotted"
                        title="Click to view entries"
                        onClick={() =>
                          window.open(
                            "/home?date=" +
                              wrappedData.week_lowest.week_start.split("T")[0],
                            "_blank",
                          )
                        }
                      >
                        {formatDateWrapped(wrappedData.week_lowest.week_start)}
                      </span>{" "}
                      was your <strong>saddest week</strong>, with an average
                      score of {wrappedData.week_lowest.avg_score.toFixed(2)}
                    </li>
                  </ul>
                </Card>

                <Card className="border-yellow bg-light_yellow p-6">
                  <h2 className="mb-2 text-xl font-semibold">Top Words</h2>
                  <span>
                    The <strong>top 10</strong> words you used in your entries
                    were:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {wrappedData.top_words.map((wordData, index) => {
                      const [word, count] = wordData.split(",");
                      return (
                        <span
                          key={index}
                          className="leading-9"
                          title={count + " times"}
                          style={{
                            fontSize: `${calculateFontSize(
                              parseInt(count),
                              wrappedData.top_words,
                            )}px`,
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </Card>
              </div>
              {graphIsLoading || graphIsError ? (
                <Spinner className="ml-8" />
              ) : (
                <Graph
                  entries={graphData!}
                  graphTitle="Your 2024 Happiness Graph"
                  range={[new Date(2024, 0, 1), new Date(2025, 0, 1)]}
                  onSelectEntry={(entry: Happiness[]) => {
                    setSelectedEntry(entry[0]);
                  }}
                />
              )}
            </>
          )}
        </>
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
