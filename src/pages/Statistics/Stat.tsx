import Card from "../../components/Card";
import { mean, median, mode, std, min, max } from "mathjs";

/**
 * Custom component for displaying stat cards
 * @param values list of happiness values used in calculating statistic
 * @param statName name of statistic value
 * @param key key for statistic
 * @returns
 */

export default function Stat({
  values,
  statName,
  key,
}: {
  values: number[];
  statName: number;
  key: number;
}) {
  let statLabel = ["Average", "Median", "Mode", "STD", "Minimum", "Maximum"];
  let calculatedStats = [
    mean(values).toFixed(2),
    median(values).toFixed(2),
    // @ts-ignore
    // for some reason, ts isn't working with this
    mode(values)[0].toFixed(1),
    // @ts-ignore
    std(values).toFixed(2),
    min(values).toFixed(1),
    max(values).toFixed(1),
  ];
  console.log(mode(values));

  return (
    <>
      <div className="flex h-[84px] w-[84px] flex-col items-center justify-center space-y-2 rounded-xl bg-light_yellow">
        <div className="text-sm font-medium text-dark_gray">
          {statLabel[statName]}
        </div>
        <div className="text-xl font-semibold text-dark_gray">
          {calculatedStats[statName]}
        </div>
      </div>
    </>
  );
}
