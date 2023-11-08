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
 * @param sidebar whether the Happiness number is inside the sidebar or not (changes style)
 * @returns
 */
export default function HappinessNumber({
  value,
  onChangeValue,
  editable,
  sidebar = false,
}: {
  value: number;
  onChangeValue: (n: number) => void;
  editable: boolean;
  sidebar?: boolean;
}) {
  // The current happiness value which is displayed to the user.
  const [currentHappiness, setCurrentHappiness] = useState(value);

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
  };

  /**
   * Whenever the happiness value that the user interacts with changes, we start
   * a timer to validate and format their happiness after .2 seconds.
   * This allows the input to be responsive but still validates the happiness.
   */
  useEffect(() => {
    clearTimeout(updateHappinessTimeout.current);
    updateHappinessTimeout.current = setTimeout(updateHappiness, 200);
  }, [currentHappiness]);

  useEffect(() => {
    setCurrentHappiness(value);
  }, [value]);

  const Changer = ({ change }: { change: number }) => (
    <div
      className={
        "flex flex-col items-center justify-center hover:cursor-pointer" +
        (sidebar
          ? " my-0.5 min-h-[15px] min-w-[15px]"
          : " min-h-[32px] min-w-[32px] rounded-full bg-gray-50")
      }
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
      <img src={(change > 0 ? ArrowUpIcon : ArrowDownIcon) as any} />
    </div>
  );

  const numInput = (
    <input
      type="text"
      value={currentHappiness === -1 ? "--" : currentHappiness.toFixed(1)}
      className={
        "resize-none border-0 border-gray-400 bg-transparent p-0 text-center font-medium focus:border-b-1 focus:outline-none" +
        (sidebar
          ? " h-[36px] max-w-[55px] text-xl"
          : " h-auto max-w-[80px] text-4xl")
      }
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
          // We don't change the current happiness until we know for sure
          // it's a valid range
          setCurrentHappiness(happinessNum);
        }
      }}
      disabled={!editable}
    />
  );
  return sidebar ? (
    <div className="flex">
      {numInput}
      <div className="flex-col">
        {editable && <Changer change={0.5} />}
        {editable && <Changer change={-0.5} />}
      </div>
    </div>
  ) : (
    <Column className=" w-full items-center">
      {editable && <Changer change={0.5} />}
      <div className="h-3" />
      {numInput}
      <div className="h-3" />
      {editable && <Changer change={-0.5} />}
    </Column>
  );
}
