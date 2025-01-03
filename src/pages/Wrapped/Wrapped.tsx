import Card from "../../components/Card";
import Graph from "../../components/Graph";
import { useQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness, HappinessWrapped } from "../../data/models/Happiness";
import { useApi } from "../../contexts/ApiProvider";
import { formatDate } from "../../utils";
import Spinner from "../../components/Spinner";
import React, { useEffect, useRef, useState } from "react";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import { createFileName, useScreenshot } from "use-react-screenshot";
import ShareIcon from "../../assets/share.svg";
import Row from "../../components/layout/Row";

export default function Wrapped() {
  const { api } = useApi();
  const {
    isLoading: wrappedIsLoading,
    data: wrappedData,
    isError: wrappedIsError,
  } = useQuery<HappinessWrapped>(["fetch wrapped"], () =>
    api.get<HappinessWrapped>("/happiness/wrapped").then((res) => res.data),
  );

  // date utilities
  const formatDateWrapped = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  const getMonthName = (date: Date) =>
    date.toLocaleString("default", { month: "long" });
  const dateWithMonth = (monthNumber: number) =>
    new Date(2024, monthNumber - 1, 1);

  // scale word fonts
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

  // happiness modal
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();
  useEffect(() => {
    if (selectedEntry) {
      window.HSOverlay.open(
        document.querySelector("#wrapped-happiness-viewer"),
      );
    }
  }, [selectedEntry]);

  // fetching happiness for modal
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

  // for exporting wrapped as image
  const wrappedRef = useRef<HTMLDivElement>(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const downloadImage = (image: string | null) => {
    const a = document.createElement("a");
    a.href = image!;
    a.download = createFileName("jpg", "happiness_app_wrapped_2024");
    a.click();
  };

  return (
    <>
      {wrappedIsLoading ? (
        <Spinner className="py-16 pl-14" text="Loading..." />
      ) : (
        <div ref={wrappedRef} className="px-6 py-10 text-gray-800">
          {wrappedIsError || wrappedData == undefined ? (
            <h5 className="mx-8">
              Unfortunately you didn't post enough entries this year to create a
              wrapped, try to use Happiness App more next year!
            </h5>
          ) : (
            <>
              <Row className="w-full items-center justify-between">
                <h1 className="flex flex-1 justify-center text-center text-3xl font-semibold">
                  {wrappedData.username}'s Happiness App Wrapped 2024
                </h1>
                <button
                  className="flex rounded-lg border-1 border-secondary p-2 shadow-md1"
                  onClick={() => {
                    takeScreenShot(wrappedRef.current!).then(downloadImage);
                  }}
                >
                  <img src={ShareIcon} className="max-w-[24px]" />
                </button>
              </Row>
              <div className="grid grid-cols-1 gap-6 rounded-lg py-8 md:grid-cols-2">
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
                      {wrappedData.mode_score.count} times in total
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
                    <li
                      className="cursor-pointer"
                      title="Click to view entry"
                      onClick={() =>
                        // Math.random() needed to force react query fetch every time
                        setDateQuery([
                          wrappedData.min_score.date,
                          Math.random().toString(),
                        ])
                      }
                    >
                      You felt the <strong>saddest</strong> on{" "}
                      <i>{formatDateWrapped(wrappedData.min_score.date)}</i>,
                      ranking your day a{" "}
                      {wrappedData.min_score.score.toFixed(1)}
                    </li>
                    <li
                      className="cursor-pointer"
                      title="Click to view entry"
                      onClick={() =>
                        setDateQuery([
                          wrappedData.max_score.date,
                          Math.random().toString(),
                        ])
                      }
                    >
                      But you felt the <strong>happiest</strong> on{" "}
                      <i>{formatDateWrapped(wrappedData.max_score.date)}</i>,
                      ranking your day a{" "}
                      {wrappedData.max_score.score.toFixed(1)}
                    </li>
                    <li
                      className="cursor-pointer"
                      title="Click to view entry"
                      onClick={() =>
                        setDateQuery([
                          wrappedData.largest_diff.end,
                          Math.random().toString(),
                        ])
                      }
                    >
                      And{" "}
                      <i>{formatDateWrapped(wrappedData.largest_diff.end)}</i>{" "}
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
                    <li
                      className="cursor-pointer"
                      title="Click to view entries"
                      onClick={() =>
                        window.open(
                          "/home?date=" +
                            formatDate(
                              dateWithMonth(wrappedData.month_highest.month),
                            ),
                          "_blank",
                        )
                      }
                    >
                      <i>
                        {getMonthName(
                          dateWithMonth(wrappedData.month_highest.month),
                        )}
                      </i>{" "}
                      was your <strong>happiest month</strong>, with an average
                      score of {wrappedData.month_highest.avg_score.toFixed(2)}
                    </li>
                    <li
                      className="cursor-pointer"
                      title="Click to view entries"
                      onClick={() =>
                        window.open(
                          "/home?date=" +
                            formatDate(
                              dateWithMonth(wrappedData.month_lowest.month),
                            ),
                          "_blank",
                        )
                      }
                    >
                      <i>
                        {getMonthName(
                          dateWithMonth(wrappedData.month_lowest.month),
                        )}
                      </i>{" "}
                      was your <strong>saddest month</strong>, with an average
                      score of {wrappedData.month_lowest.avg_score.toFixed(2)}
                    </li>
                    <li
                      className="cursor-pointer"
                      title="Click to view entries"
                      onClick={() =>
                        window.open(
                          "/home?date=" +
                            wrappedData.week_highest.week_start.split("T")[0],
                          "_blank",
                        )
                      }
                    >
                      <i>
                        {formatDateWrapped(wrappedData.week_highest.week_start)}
                      </i>{" "}
                      was your <strong>happiest week</strong>, with an average
                      score of {wrappedData.week_highest.avg_score.toFixed(2)}
                    </li>
                    <li
                      className="cursor-pointer"
                      title="Click to view entries"
                      onClick={() =>
                        window.open(
                          "/home?date=" +
                            wrappedData.week_lowest.week_start.split("T")[0],
                          "_blank",
                        )
                      }
                    >
                      <i>
                        {formatDateWrapped(wrappedData.week_lowest.week_start)}
                      </i>{" "}
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
        </div>
      )}
      {selectedEntry && (
        <HappinessViewerModal
          happiness={selectedEntry}
          id="wrapped-happiness-viewer"
        />
      )}
    </>
  );
}
