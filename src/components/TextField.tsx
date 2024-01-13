import Column from "./layout/Column";
import React, { useRef, useState } from "react";
import Row from "./layout/Row";

interface TextFieldProps {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  hint?: string;
  supportingText?: string;
  supportingIcon?: React.ReactElement;
  innerElements?: React.ReactElement;
  innerIcon?: React.ReactElement;
  hasError?: boolean;
  isEnabled?: boolean;
  value: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onEnterPressed?: () => void;
  tooltip?: string;
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
  label,
  type = "text",
  hint = "",
  supportingText = "",
  supportingIcon,
  innerElements,
  innerIcon,
  hasError = false,
  isEnabled = true,
  value,
  onChangeValue,
  className = "",
  onEnterPressed,
  tooltip = "",
}: TextFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle =
    "focus:shadow-form-selected flex-wrap items-center rounded-lg border-1 px-4 py-1 " +
    (isFocused
      ? " shadow-form-selected border-yellow hover:border-yellow"
      : "") +
    (hasError
      ? " border-error hover:border-error"
      : " border-gray-300 hover:border-gray-400");

  return (
    <Column className={"w-[250px] gap-1 " + className}>
      {label && <p className="font-normal text-gray-400">{label}</p>}
      <Row className={borderStyle}>
        {innerElements}
        {innerElements && <div className="mr-2"></div>}
        <input
          className="flex-grow focus:outline-none"
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
          title={tooltip}
        />
        <span className="h-6">{innerIcon}</span>
      </Row>
      {(supportingText || supportingIcon) && (
        <Row className="items-center gap-1">
          {supportingIcon}
          {supportingText && (
            <label
              className={
                "font-normal" + (hasError ? " text-error" : " text-gray-400")
              }
            >
              {supportingText}
            </label>
          )}
        </Row>
      )}
    </Column>
  );
}
