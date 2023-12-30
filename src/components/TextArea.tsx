import Column from "./layout/Column";
import { useRef, useState } from "react";
import Row from "./layout/Row";
interface TextFieldProps {
  title?: string;
  type?: React.HTMLInputTypeAttribute;
  defaultText?: string;
  hint?: string;
  supportingText?: string;
  supportingIcon?: React.ReactElement;
  innerIcon?: React.ReactElement;
  hasError?: boolean;
  isEnabled?: boolean;
  value: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onEnterPressed?: () => void;
}
/**
 * Generic TextField component for use for Happiness App
 * @param value text field content
 * @param onChangeValue action when the value changes
 * @param className style to default to if editingStyle, disabledStyle, or emptyStyle is null
 * @param disabledStyle style to use whenever the textarea is disabled
 * @param emptyStyle style to use when text field content is empty but the text field is not disabled
 * @param editingStyle style to use when the text field is not disabled and not empty
 * @param enabled a boolean value representing whether the textarea is enabled
 * @returns TextArea component
 */
export default function TextField({
  title,
  type = "text",
  defaultText = "",
  hint = "",
  supportingText = "",
  supportingIcon,
  innerIcon,
  hasError = false,
  isEnabled = true,
  value,
  onChangeValue,
  className = "",
  onEnterPressed
}: TextFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  console.log(`hasError = ${hasError}`);
  return (
    <Column className={"w-[250px] gap-1 " + className}>
      {title && <p className="text-gray-400">{title}</p>}
      <Row
        className={
          "border-gray-300 focus:shadow-form-selected items-center rounded-lg border-1 border-solid py-1 hover:border-gray-400" +
          (isFocused
            ? " shadow-form-selected border-yellow hover:border-yellow"
            : "") +
          (hasError ? " border-error hover:border-error" : "")
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
      {(supportingText || supportingIcon) && (
        <Row className="items-center gap-1">
          {supportingIcon}
          {supportingText && (
            <label className={hasError ? " text-error" : " text-gray-400"}>
              {supportingText}
            </label>
          )}
        </Row>
      )}
      {/* <div className=" border-1 border-solid rounded-lg border-gray-300 hover:border-gray-400 focus:border-yellow shadow-form-selected"></div> */}
    </Column>
  );
}
