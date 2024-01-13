import { useRef, useState } from "react";
import IconWarningOutline from "../assets/IconWarningOutline";
import Column from "./layout/Column";
import Row from "./layout/Row";
interface TextFieldProps {
  title?: string;
  type?: React.HTMLInputTypeAttribute;
  hint?: string;
  supportingText?: string;
  supportingIcon?: React.ReactElement;
  innerIcon?: React.ReactElement;
  hasError?: boolean;
  errorText?: string;
  isEnabled?: boolean;
  value: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onEnterPressed?: () => void;
}
/**
 * TextArea component for Happiness App
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
 * @returns TextArea component 
 */
export default function TextArea({
  title,
  type = "text",
  hint = "",
  supportingText = "",
  supportingIcon,
  innerIcon,
  hasError = false,
  errorText = "",
  isEnabled = true,
  value,
  onChangeValue,
  className = "",
  onEnterPressed
}: TextFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle = "focus:shadow-form-selected items-center rounded-lg border-1 border-solid py-1 " +
    (isFocused
      ? " shadow-form-selected border-yellow hover:border-yellow"
      : "") +
    (hasError ? " border-error hover:border-error" : " hover:border-gray-400 border-gray-300");

  return (
    <Column className={"w-[250px] gap-1 " + className}>
      {title && <p className="text-gray-400">{title}</p>}
      <Row
        className={
          borderStyle
        }
      >
        <input
          className="ml-4 w-full focus:outline-none"
          ref={input}
          type={type}
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
        />
        <span className="mr-4 my-0 py-0 h-6">{innerIcon}</span>
      </Row>
      {(supportingText || supportingIcon || hasError) && (
        <Row className="items-center gap-1">
          {hasError ? <IconWarningOutline color="#EC7070" /> : supportingIcon}
          {supportingText && (
            <label className="text-gray-400">
              {supportingText}
            </label>
          )}
          {hasError && errorText && (
            <label className="text-error">
              {errorText}
            </label>
          )}
        </Row>
      )}
    </Column>
  );
}
