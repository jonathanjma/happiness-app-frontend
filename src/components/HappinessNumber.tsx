import ArrowDownIcon from "../assets/arrow_down.svg";
import ArrowUpIcon from "../assets/arrow_up.svg";
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
  // The current happiness value.
  const [currentHappiness, setCurrentHappiness] = useState<number>(value);
  // The happiness string displayed to the user
  const [happinessDisplay, setHappinessDisplay] = useState<string>("--");

  const updateHappinessTimeout = useRef<number | undefined>(undefined);
  /**
   * Update Happiness function
   * Function responsible for validating and changing the "true" happiness value
   * Where the true happiness value is the happiness value that is final after
   * the happiness validator validates the input
   *
   * Precondition: `currentHappiness` is in the range from 0 to 10 inclusive
   * This is always satisfied because the user's input will never reach
   * `currentHappiness` if it is not in the bounds.
   */
  const updateHappiness = () => {
    const validHappiness = Math.round(currentHappiness * 2) / 2;
    /*
    onChangeValue is what allows the current happiness to propogate up the 
    components, but this is only called on happiness rounded to the nearest 0.5
    */
    onChangeValue(validHappiness);
    setCurrentHappiness(validHappiness);
    setHappinessDisplay(
      validHappiness === -1 ? "--" : validHappiness.toFixed(1),
    );
  };

  /**
   * Whenever the happiness value that the user interacts with changes, we start
   * a timer to validate and format their happiness after .2 seconds.
   * This allows the input to be responsive but still validates the happiness.
   */
  useEffect(() => {
    clearTimeout(updateHappinessTimeout.current);
    updateHappinessTimeout.current = setTimeout(updateHappiness, 500);
  }, [currentHappiness]);

  useEffect(() => {
    setCurrentHappiness(value);
    setHappinessDisplay(value === -1 ? "--" : value.toFixed(1));
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
            setHappinessDisplay(newHappiness.toFixed(1));
            return newHappiness;
          });
        }
      }}
    >
      <img src={(change > 0 ? ArrowUpIcon : ArrowDownIcon) as any} />
    </div>
  );
  return (
    <Column className=" w-full items-center">
      {editable && <Changer change={0.5} />}
      <div className=" h-3" />
      <input
        type="text"
        value={happinessDisplay}
        className="h-auto max-w-[80px] resize-none border-0 border-gray-400 bg-transparent p-0 text-center text-4xl font-medium focus:border-b-1 focus:outline-none"
        onChange={(e) => {
          clearTimeout(updateHappinessTimeout.current);
          let happinessNum = 0;
          if (e.target.value !== "") {
            happinessNum = parseFloat(
              e.target.value.substring(e.target.value.indexOf("-") + 1),
            );
            if (happinessNum < 0) {
              happinessNum *= -1;
            }
            // While loop is unncessary but does make absolutley sure it is in range
            while (happinessNum > 10) {
              happinessNum /= 10;
            }
          }
          // We don't change the current happiness until we know for sure
          // it's a valid range
          setCurrentHappiness(happinessNum);
          setHappinessDisplay(happinessNum.toString());
        }}
        disabled={!editable}
      />
      <div className=" h-3" />

      {editable && <Changer change={-0.5} />}
    </Column>
  );
}
