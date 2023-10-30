import ArrowDownIcon from "../assets/ArrowDownIcon";
import ArrowUpIcon from "../assets/ArrowUpIcon";
import Column from "./layout/Column";
import { useEffect, useRef, useState } from "react";

/**
 * Component represeting the Happiness number.
 * Has editable and fixed states.
 * @param value the value of the happiness number
 * @param onChangeValue what to do with the value after it has been edited and validated
 * @param editable whether the Happiness number is in editable state
 * @returns
 */
export default function HappinessNumber({
  value,
  onChangeValue,
  editable,
}: {
  value: number;
  onChangeValue: (n: number) => void;
  editable: boolean;
}) {
  const [currentHappiness, setCurrentHappiness] = useState(value);

  const updateHappinessTimeout = useRef<number | undefined>(undefined);
  /**
   * Update Happiness function
   * Function responsible for validating and changing the "true" happiness value
   * Where the true happiness value is the happiness value that is final after
   * the happiness validator validates the input
   *
   * Precondition: `currentHappiness` is in the range from 0 to 10 inclusive
   */
  const updateHappiness = () => {
    const validHappiness = Math.round(currentHappiness * 2) / 2;
    onChangeValue(validHappiness);
    setCurrentHappiness(validHappiness);
  };

  useEffect(() => {
    clearTimeout(updateHappinessTimeout.current);
    updateHappinessTimeout.current = setTimeout(updateHappiness, 200);
  }, [currentHappiness]);

  useEffect(() => {
    setCurrentHappiness(value);
  }, [value]);

  const Changer = ({ change }: { change: number }) => (
    <div
      className="flex min-h-[32px] min-w-[32px] flex-col items-center justify-center rounded-full bg-gray-50 hover:cursor-pointer"
      onClick={() => {
        if (editable) {
          setCurrentHappiness((current) => {
            let newHappiness = current + change;
            newHappiness = Math.max(newHappiness, 0);
            newHappiness = Math.min(newHappiness, 10);
            return newHappiness;
          });
        }
      }}
    >
      {change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </div>
  );
  return (
    <Column className=" w-full items-center">
      {editable && <Changer change={0.5} />}
      <div className=" h-3" />
      <input
        type="text"
        value={currentHappiness === -1 ? "--" : currentHappiness}
        className="h-auto max-w-[80px] resize-none border-0 border-gray-400 bg-transparent p-0 text-center text-4xl font-medium focus:border-b-1 focus:outline-none"
        onChange={(e) => {
          if (e) {
            clearTimeout(updateHappinessTimeout.current);
            let happinessNum = 0;
            if (e.target.value !== "") {
              happinessNum = parseFloat(e.target.value);
              if (happinessNum < 0) {
                happinessNum *= -1;
              }
              // While loop is unncessary but does make absolutley sure it is in range
              while (happinessNum > 10) {
                happinessNum /= 10;
              }
            }

            setCurrentHappiness(happinessNum);
          }
        }}
        disabled={!editable}
      />
      <div className=" h-3" />

      {editable && <Changer change={-0.5} />}
    </Column>
  );
}
