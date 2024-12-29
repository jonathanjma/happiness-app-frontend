import Card from "../../components/Card";

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

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

  return (
    <div className="text-gray-800">
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-center text-3xl font-bold">
          {data.username}'s Happiness App Wrapped 2024
        </h1>
        <div className="grid grid-cols-1 gap-6 rounded-lg p-6 md:grid-cols-2">
          <Card className="border-yellow bg-light_yellow p-6">
            <h2 className="text-xl font-semibold">General Stats</h2>
            <ul className="mt-2 space-y-1.5">
              <li>
                <strong>Total Entries:</strong> {data.entries}
              </li>
              <li>
                <strong>Percentile:</strong> Top{" "}
                {(data.top_pct * 100).toFixed(1)}% of active users
              </li>
              <li>
                <strong>Average Score:</strong> {data.average_score.toFixed(2)}
              </li>
              <li>
                <strong>Mode Score:</strong> {data.mode_score.score} (
                {data.mode_score.count} occurrences)
              </li>
            </ul>
          </Card>

          <Card className="border-yellow bg-light_yellow p-6">
            <h2 className="text-xl font-semibold">Streaks and Extremes</h2>
            <ul className="mt-2 space-y-1.5">
              <li>
                <strong>Longest Streak:</strong> {data.longest_streak.days} days
                (from {formatDate(data.longest_streak.start)} to{" "}
                {formatDate(data.longest_streak.end)})
              </li>
              <li>
                <strong>Minimum Score:</strong> {data.min_score.score} (on{" "}
                {formatDate(data.min_score.date)})
              </li>
              <li>
                <strong>Maximum Score:</strong> {data.max_score.score} (on{" "}
                {formatDate(data.max_score.date)})
              </li>
              <li>
                <strong>Largest Score Difference:</strong>{" "}
                {data.largest_diff.diff} (from{" "}
                {formatDate(data.largest_diff.start)} to{" "}
                {formatDate(data.largest_diff.end)})
              </li>
            </ul>
          </Card>

          <Card className="border-yellow bg-light_yellow p-6">
            <h2 className="text-xl font-semibold">Monthly and Weekly Trends</h2>
            <ul className="mt-2 space-y-1.5">
              <li>
                <strong>Highest Month Average:</strong>{" "}
                {data.month_highest.avg_score.toFixed(2)} (Month:{" "}
                {getMonthName(data.month_highest.month)})
              </li>
              <li>
                <strong>Lowest Month Average:</strong>{" "}
                {data.month_lowest.avg_score.toFixed(2)} (Month:{" "}
                {getMonthName(data.month_lowest.month)})
              </li>
              <li>
                <strong>Highest Week Average:</strong>{" "}
                {data.week_highest.avg_score.toFixed(2)} (Week starting{" "}
                {formatDate(data.week_highest.week_start)})
              </li>
              <li>
                <strong>Lowest Week Average:</strong>{" "}
                {data.week_lowest.avg_score.toFixed(2)} (Week starting{" "}
                {formatDate(data.week_lowest.week_start)})
              </li>
            </ul>
          </Card>

          <Card className="border-yellow bg-light_yellow p-6">
            <h2 className="text-xl font-semibold">Top Words</h2>
            <div className="mt-2 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
