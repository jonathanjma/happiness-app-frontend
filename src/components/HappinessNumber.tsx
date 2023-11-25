import { Constants } from "../constants";
import Column from "./layout/Column";
import { useEffect, useRef, useState } from "react";

/**
 * Component represeting the Happiness number.
 * Has editable and fixed states.
 * @param value the value of the happiness number
 * @param onChangeValue what to do with the value after it has been edited and validated
 * @param editable whether the Happiness number is in editable state
 * @param sidebarStyle represents whether the sidebar style is used or not (default: false)
 * @returns
 */
export default function HappinessNumber({
  value,
  onChangeValue,
  editable,
  setNetworkingState,
  sidebarStyle = false,
}: {
  value: number;
  onChangeValue: (n: number) => void;
  editable: boolean;
  setNetworkingState: React.Dispatch<React.SetStateAction<string>>;
  sidebarStyle?: boolean;
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
    setNetworkingState(Constants.LOADING_MUTATION_TEXT);
    updateHappinessTimeout.current = setTimeout(updateHappiness, 500);
  }, [currentHappiness]);

  useEffect(() => {
    setCurrentHappiness(value);
    setHappinessDisplay(value === -1 ? "--" : value.toFixed(1));
  }, [value]);

  const Changer = ({ change }: { change: number; }) => (
    <div
      className={
        "flex flex-col items-center justify-center hover:cursor-pointer" +
        (sidebarStyle
          ? " my-0.5 min-h-[15px] min-w-[15px]"
          : " min-h-[32px] min-w-[32px] rounded-full bg-gray-50")
      }
      onClick={() => {
        if (editable) {
          setCurrentHappiness((current) => {
            setNetworkingState(Constants.LOADING_MUTATION_TEXT);
            let newHappiness = current + change;
            newHappiness = Math.max(newHappiness, 0);
            newHappiness = Math.min(newHappiness, 10);
            setHappinessDisplay(newHappiness.toFixed(1));
            return newHappiness;
          });
        }
      }}
    >
      {change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </div>
  );

  const NumInput = () => (
    <Column>
      <input
        type="text"
        value={happinessDisplay}
        className={
          "resize-none border-0 border-gray-400 bg-transparent p-0 text-center font-medium focus:border-b-1 focus:outline-none" +
          (sidebarStyle
            ? " h-[36px] max-w-[55px] text-xl"
            : " h-auto max-w-[80px] text-4xl")
        }
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

  return sidebarStyle ? (
    <div className="flex">
      <NumInput />
      <div className="flex-col">
        {editable && <Changer change={0.5} />}
        {editable && <Changer change={-0.5} />}
      </div>
    </div>
  ) : (
    <Column className=" w-full items-center">
      {editable && <Changer change={0.5} />}
      <div className="h-3" />
      <NumInput />
      <div className="h-3" />
      {editable && <Changer change={-0.5} />}
    </Column>
  );
}

const ArrowUpIcon = () => <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0_1909_7051)">
    <path d="M9.79222 4.39779C9.3547 3.96024 8.6453 3.96024 8.20778 4.39779L2.39803 10.2077C1.9605 10.6453 1.25111 10.6453 0.813586 10.2077L0.792165 10.1863C0.35466 9.7488 0.35466 9.03946 0.792165 8.60194L8.20778 1.18605C8.6453 0.748507 9.3547 0.748507 9.79222 1.18605L17.2078 8.60194C17.6453 9.03946 17.6453 9.7488 17.2078 10.1863L17.1864 10.2077C16.7489 10.6453 16.0395 10.6453 15.602 10.2077L9.79222 4.39779Z" fill="#575F68" />
  </g>
  <defs>
    <clipPath id="clip0_1909_7051">
      <rect width="10.6062" height="18" fill="white" transform="matrix(0 -1 1 0 0 11)" />
    </clipPath>
  </defs>
</svg>;

const ArrowDownIcon = () => <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0_1909_7054)">
    <path d="M8.20778 6.60221C8.6453 7.03976 9.3547 7.03976 9.79222 6.60221L15.602 0.792253C16.0395 0.354709 16.7489 0.354708 17.1864 0.792253L17.2078 0.813674C17.6453 1.2512 17.6453 1.96054 17.2078 2.39806L9.79222 9.81395C9.3547 10.2515 8.6453 10.2515 8.20778 9.81395L0.792166 2.39806C0.35466 1.96054 0.354658 1.2512 0.792164 0.813674L0.813585 0.792253C1.25111 0.354708 1.9605 0.354708 2.39803 0.792253L8.20778 6.60221Z"
      fill="#575F68" />
  </g>
  <defs>
    <clipPath id="clip0_1909_7054">
      <rect width="10.6062" height="18" fill="white" transform="matrix(0 1 -1 0 18 0)" />
    </clipPath>
  </defs>
</svg>;