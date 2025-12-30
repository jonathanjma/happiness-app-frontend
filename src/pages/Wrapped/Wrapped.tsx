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
    // IMPORTANT: "YYYY-MM-DD" parses as UTC per spec, which can display as the
    // previous day in local timezones. Force local midnight for date-only strings.
    const normalized = dateString.includes("T")
      ? dateString
      : `${dateString}T00:00:00`;
    const date = new Date(normalized);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const wrappedYear = new Date().getFullYear();

  const normalizeDateForEntryLookup = (dateString: string) => {
    // Backend timestamps typically include a time; keep this robust for YYYY-MM-DD.
    return dateString.includes("T") ? dateString : `${dateString}T00:00:00`;
  };

  const monthDate = (monthNumber: number) =>
    new Date(wrappedYear, monthNumber - 1, 1);

  const monthName = (monthNumber: number) =>
    monthDate(monthNumber).toLocaleString("default", { month: "long" });

  const openEntriesForDate = (dateString: string) => {
    window.open(`/home?date=${dateString.split("T")[0]}`, "_blank");
  };

  const openEntriesForMonth = (monthNumber: number) => {
    window.open(`/home?date=${formatDate(monthDate(monthNumber))}`, "_blank");
  };

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

  const {
    isLoading: graphIsLoading,
    data: graphData,
    isError: graphIsError,
  } = useQuery<Happiness[]>(
    [QueryKeys.FETCH_HAPPINESS, "wrapped year", wrappedYear],
    () =>
      api
        .get<Happiness[]>("/happiness/", {
          start: formatDate(new Date(wrappedYear, 0, 1)),
          end: formatDate(new Date(wrappedYear + 1, 0, 1)),
        })
        .then((res) => res.data),
  );

  // for exporting wrapped as image
  const wrappedRef = useRef<HTMLDivElement>(null);
  const [, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  const downloadImage = (image: string | null) => {
    const a = document.createElement("a");
    a.href = image!;
    a.download = createFileName("jpg", `happiness_app_wrapped_${wrappedYear}`);
    a.click();
  };

  // Stepper state must live here (NOT inside WrappedStory), otherwise any state
  // update (like opening the entry viewer) can remount the story and reset it.
  const [step, setStep] = useState(0);

  const StatPill = ({
    label,
    value,
    hint,
  }: {
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-secondary/30 bg-white/60 px-3 py-2 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      {hint != null && (
        <div className="mt-0.5 text-xs text-gray-600">{hint}</div>
      )}
    </div>
  );

  const AtAGlance = ({ data }: { data: HappinessWrapped }) => (
    <Card className="border-yellow bg-light_yellow p-6">
      <h2 className="text-xl font-semibold">At a glance</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatPill label="Entries" value={data.entries} />
        <StatPill label="Top %" value={`${(data.top_pct * 100).toFixed(1)}%`} />
        <StatPill
          label="Words"
          value={data.total_words != null ? data.total_words : "—"}
        />
        <StatPill label="Avg score" value={data.average_score.toFixed(2)} />
        <StatPill
          label="Most common score"
          value={data.mode_score.score.toFixed(1)}
          hint={`${data.mode_score.count} times`}
        />
        <StatPill
          label="Longest streak"
          value={`${data.longest_streak.days} days`}
          hint={`${formatDateWrapped(data.longest_streak.start)} – ${formatDateWrapped(data.longest_streak.end)}`}
        />
      </div>
      <div className="mt-4 text-sm text-gray-700">
        A quick snapshot of your year before we dive into the highlights.
      </div>
    </Card>
  );

  const Themes = ({ data }: { data: HappinessWrapped }) => {
    const themes = data.yearly?.top_3_themes ?? [];
    const happy = data.score_bands?.theme_8_10 ?? [];
    const sad = data.score_bands?.theme_0_4 ?? [];

    return (
      <Card className="border-yellow bg-light_yellow p-6">
        <h2 className="text-xl font-semibold">Themes</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-gray-800">
              3 phrases for your year
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-secondary/40 bg-white px-3 py-1 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-800">
              Things that made you happy
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
              {happy.slice(0, 3).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-800">
              Things that made you sad
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
              {sad.slice(0, 3).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    );
  };

  const Extremes = ({ data }: { data: HappinessWrapped }) => (
    <Card className="border-yellow bg-light_yellow p-6">
      <h2 className="text-xl font-semibold">Extremes</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/60 p-4">
          <div className="text-sm font-semibold text-gray-800">
            Lowest day
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <span className="font-medium">
              {formatDateWrapped(data.min_score.date)}
            </span>{" "}
            · {data.min_score.score.toFixed(1)}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {data.min_score.ai_summary ?? ""}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
              onClick={() =>
                setDateQuery([data.min_score.date, Math.random().toString()])
              }
              title="View entry"
            >
              View entry
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white/60 p-4">
          <div className="text-sm font-semibold text-gray-800">
            Highest day
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <span className="font-medium">
              {formatDateWrapped(data.max_score.date)}
            </span>{" "}
            · {data.max_score.score.toFixed(1)}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {data.max_score.ai_summary ?? ""}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
              onClick={() =>
                setDateQuery([data.max_score.date, Math.random().toString()])
              }
              title="View entry"
            >
              View entry
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  const BiggestSwing = ({ data }: { data: HappinessWrapped }) => (
    <Card className="border-yellow bg-light_yellow p-6">
      <h2 className="text-xl font-semibold">Biggest swing</h2>
      <div className="mt-4 rounded-xl bg-white/60 p-4">
        <div className="text-sm text-gray-700">
          From{" "}
          <span className="font-medium">
            {formatDateWrapped(data.largest_diff.start_date)}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {formatDateWrapped(data.largest_diff.end_date)}
          </span>
        </div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">
          {data.largest_diff.score_difference}
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {data.largest_diff.ai_summary}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
            onClick={() =>
              setDateQuery([
                data.largest_diff.start_date,
                Math.random().toString(),
              ])
            }
            title="View start day entry"
          >
            View start day
          </button>
          <button
            className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
            onClick={() =>
              setDateQuery([
                data.largest_diff.end_date,
                Math.random().toString(),
              ])
            }
            title="View end day entry"
          >
            View end day
          </button>
        </div>
      </div>
    </Card>
  );

  const Trends = ({ data }: { data: HappinessWrapped }) => (
    <Card className="border-yellow bg-light_yellow p-6">
      <h2 className="text-xl font-semibold">Trends</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/60 p-4">
          <div className="text-sm font-semibold text-gray-800">Months</div>

          <div className="mt-3">
            <div className="text-sm text-gray-700">
              Happiest month:{" "}
              <span className="font-medium">
                {monthName(data.month_highest.month)}
              </span>{" "}
              · {data.month_highest.avg_score.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {data.month_highest.ai_summary}
            </div>
            <div className="mt-2">
              <button
                className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
                onClick={() => openEntriesForMonth(data.month_highest.month)}
              >
                View month
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-700">
              Saddest month:{" "}
              <span className="font-medium">
                {monthName(data.month_lowest.month)}
              </span>{" "}
              · {data.month_lowest.avg_score.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {data.month_lowest.ai_summary}
            </div>
            <div className="mt-2">
              <button
                className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
                onClick={() => openEntriesForMonth(data.month_lowest.month)}
              >
                View month
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/60 p-4">
          <div className="text-sm font-semibold text-gray-800">Weeks</div>

          <div className="mt-3">
            <div className="text-sm text-gray-700">
              Happiest week starting{" "}
              <span className="font-medium">
                {formatDateWrapped(data.week_highest.week_start)}
              </span>{" "}
              · {data.week_highest.avg_score.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {data.week_highest.ai_summary}
            </div>
            <div className="mt-2">
              <button
                className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
                onClick={() => openEntriesForDate(data.week_highest.week_start)}
              >
                View week
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-700">
              Saddest week starting{" "}
              <span className="font-medium">
                {formatDateWrapped(data.week_lowest.week_start)}
              </span>{" "}
              · {data.week_lowest.avg_score.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {data.week_lowest.ai_summary}
            </div>
            <div className="mt-2">
              <button
                className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
                onClick={() => openEntriesForDate(data.week_lowest.week_start)}
              >
                View week
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const Moments = ({ data }: { data: HappinessWrapped }) => {
    const cards = [
      {
        title: "Craziest moment",
        date: data.yearly.strangest_entry.date,
        summary: data.yearly.strangest_entry.summary,
      },
      {
        title: "Most overthinking",
        date: data.yearly.overthinking_entry.date,
        summary: data.yearly.overthinking_entry.summary,
      },
      {
        title: "Most down bad",
        date: data.yearly.down_bad_entry.date,
        summary: data.yearly.down_bad_entry.summary,
      },
    ] as const;

    return (
      <Card className="border-yellow bg-light_yellow p-6">
        <h2 className="text-xl font-semibold">Moments</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl bg-white/60 p-4">
              <div className="text-sm font-semibold text-gray-800">
                {c.title}
              </div>
              <div className="mt-1 text-sm text-gray-700">
                <span className="font-medium">
                  {formatDateWrapped(c.date)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-700">{c.summary}</div>
              <div className="mt-3">
                <button
                  className="rounded-lg border border-secondary/50 bg-white px-3 py-1.5 text-sm shadow-sm"
                  onClick={() =>
                    setDateQuery([
                      normalizeDateForEntryLookup(c.date),
                      Math.random().toString(),
                    ])
                  }
                >
                  View entry
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const GraphSlide = () => (
    <Card className="border-yellow bg-light_yellow p-6">
      <h2 className="text-xl font-semibold">Your happiness graph</h2>
      <div className="mt-4">
        {graphIsLoading || graphIsError ? (
          <Spinner className="ml-2" />
        ) : (
          <Graph
            entries={graphData!}
            graphTitle={`${wrappedYear} Happiness Graph`}
            range={[new Date(wrappedYear, 0, 1), new Date(wrappedYear + 1, 0, 1)]}
            onSelectEntry={(entry: Happiness[]) => {
              setSelectedEntry(entry[0]);
            }}
          />
        )}
      </div>
    </Card>
  );

  const WrappedStory = ({
    data,
    step,
    setStep,
  }: {
    data: HappinessWrapped;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
  }) => {
    const steps = [
      {
        title: "At a glance",
        render: <AtAGlance data={data} />,
      },
      {
        title: "Themes",
        render: <Themes data={data} />,
      },
      {
        title: "Extremes",
        render: <Extremes data={data} />,
      },
      {
        title: "Biggest swing",
        render: <BiggestSwing data={data} />,
      },
      {
        title: "Trends",
        render: <Trends data={data} />,
      },
      {
        title: "Moments",
        render: <Moments data={data} />,
      },
      {
        title: "Graph",
        render: <GraphSlide />,
      },
    ] as const;
    const current = steps[step];

    // If steps change (dev/hot reload), keep step index valid.
    useEffect(() => {
      if (step > steps.length - 1) setStep(steps.length - 1);
    }, [step, steps.length, setStep]);

    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            Story · Step {step + 1} of {steps.length}: {current.title}
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-secondary/40 bg-white px-3 py-1.5 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </button>
            <button
              className="rounded-lg border border-secondary/40 bg-white px-3 py-1.5 text-sm shadow-sm disabled:opacity-50"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={step === steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-secondary transition-all"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {current.render}
      </div>
    );
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
                  {wrappedData.username}'s Happiness App Wrapped {wrappedYear}
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

              <WrappedStory data={wrappedData} step={step} setStep={setStep} />
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
