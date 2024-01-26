/**
 * Custom component that includes two buttons that switch given radioValue.
 * radioValue must be either 1 (when left button is clicked) or 2 (when right button is clicked)
 * @param radioValue variable that is changed when button is clicked (must be either 1 or 2)
 * @param setRadioValue function setting radioValue variable
 * @param labels two-element list of the left and right button labels
 * @returns
 */

import Row from "./layout/Row";
export default function RadioButton({
  radioValue,
  setRadioValue,
  labels,
}: {
  radioValue: number;
  setRadioValue: (newValue: number) => void;
  labels: string[];
}) {
  return (
    <Row className="w-[256px]">
      <button
        className={
          "w-1/2 rounded-l-lg border border-1.5 p-1 " +
          (radioValue === 1
            ? "border-yellow bg-yellow text-secondary"
            : "border-r-0.5 border-gray-100 bg-white text-gray-600")
        }
        onClick={() => {
          setRadioValue(1);
        }}
      >
        <label
          className={
            "select-none text-base hover:cursor-pointer " +
            (radioValue === 1 ? "font-semibold" : "font-medium")
          }
        >
          {labels[0]}
        </label>
      </button>
      <button
        className={
          "border-right w-1/2 rounded-r-lg border-1.5 p-1 " +
          (radioValue === 2
            ? "border-yellow bg-yellow text-secondary"
            : "border-l-0.5 border-gray-100 bg-white text-gray-600")
        }
        onClick={() => {
          setRadioValue(2);
        }}
      >
        <label
          className={
            "select-none text-base hover:cursor-pointer " +
            (radioValue === 2 ? "font-semibold" : "font-medium")
          }
        >
          {labels[1]}
        </label>
      </button>
    </Row>
  );
}
