import { useRef, useState } from "react";
import IconWarningOutline from "../assets/IconWarningOutline";
import Column from "./layout/Column";
import Row from "./layout/Row";

interface TextFieldProps {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  hint?: string;
  autocomplete?: string;
  inputID?: string;
  supportingText?: string;
  supportingIcon?: React.ReactElement;
  innerElements?: React.ReactElement;
  innerIcon?: React.ReactElement;
  hasError?: boolean;
  errorText?: string;
  isEnabled?: boolean;
  value: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onEnterPressed?: () => void;
  tooltip?: string;
  grow?: boolean;
}

/**
 * TextField component for Happiness App
 * @param title the title of the text area
 * @param type the type of the input element
 * @param hint the hint text for the text area
 * @param supportingText the supporting text for the text area
 * @param supportingIcon the supporting icon for the text area, will only show if hasError is false
 * @param innerIcon the inner icon for the text area
 * @param hasError a boolean value indicating whether the text area has an error
 * @param errorText text that will only show if there is an error, will show even if there is supporting text
 * @param isEnabled a boolean value indicating whether the text area is enabled
 * @param value the value of the text area
 * @param onChangeValue the function to handle value changes
 * @param className the class name for the text area
 * @param onEnterPressed the function to handle enter key press
 * @param tooltip string to use as tooltip
 * @returns TextArea component
 */
export default function TextField({
  label,
  type = "text",
  hint,
  autocomplete,
  inputID,
  supportingText = "",
  supportingIcon,
  innerElements,
  innerIcon,
  hasError = false,
  errorText = "",
  isEnabled = true,
  value,
  onChangeValue,
  className = "",
  onEnterPressed,
  tooltip,
}: TextFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle =
    `flex flex-grow focus:shadow-form-selected flex-wrap items-center rounded-lg border-1 px-4 py-1 ` +
    (isFocused
      ? " shadow-form-selected border-yellow hover:border-yellow"
      : "") +
    (hasError
      ? " border-error hover:border-error"
      : " border-gray-300 hover:border-gray-400");

  return (
    <Column className={`gap-1 ` + className}>
      {label && <p className="font-normal text-gray-400">{label}</p>}
      <Row className={borderStyle}>
        {innerElements}
        {innerElements && <div className="mr-2"></div>}
        <input
          className="flex flex-grow focus:outline-none"
          id={inputID}
          ref={input}
          type={type}
          autoComplete={autocomplete}
          value={value}
          disabled={!isEnabled}
          onChange={(e) => {
            onChangeValue(e.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder={hint}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onEnterPressed) {
              onEnterPressed();
            }
          }}
          title={tooltip}
        />
        {innerIcon && <div className="flex flex-1" />}
        {innerIcon && <span className="my-0 h-6 py-0">{innerIcon}</span>}
      </Row>
      {(supportingText || supportingIcon || hasError) && (
        <Row className="items-center gap-1">
          {hasError ? <IconWarningOutline color="#EC7070" /> : supportingIcon}
          {supportingText && (
            <label className="text-gray-400">{supportingText}</label>
          )}
          {hasError && errorText && (
            <label className="text-error">{errorText}</label>
          )}
        </Row>
      )}
    </Column>
  );
}
