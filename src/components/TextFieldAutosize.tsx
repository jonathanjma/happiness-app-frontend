import { useState } from "react";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";
import Column from "./layout/Column";
import Row from "./layout/Row";

interface TextFieldAutosizeProps extends TextareaAutosizeProps {
  /**
   * Text that will appear above the text field
   */
  label?: string;
  /**
   * Text that will appear below the text field
   */
  supportingText?: string;
  /**
   * Icon that will appear below the text field, along with supporting text
   */
  supportingIcon?: string;
  /**
   * Elements that appear to the left of the input, inside the input box
   */
  innerElements?: React.ReactElement;
  /**
   * Icon that appears to the left of the input, inside the input box
   */
  innerIcon?: React.ReactElement;
  /**
   * When this text is defined, the text box will show this text along with the 
   * error icon, potentially instead of the supporting text
   */
  errorText?: string;
  /**
   * Whether the text field is enabled
   */
  isEnabled?: boolean;
  /**
   * Action for when enter key is pressed, only will activate when enter key is
   * pressed and shift is NOT held
   */
  onEnterKeyPressed?: () => void;
}
export default function TextFieldAutosize({
  label,
  supportingText,
  supportingIcon,
  innerElements,
  errorText,
  isEnabled,
  className,
  onEnterKeyPressed,
  ...rest
}: TextFieldAutosizeProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle =
    `flex flex-grow items-start focus:shadow-form-selected flex-wrap items-center rounded-lg border-1 px-4 py-1 ` +
    (isFocused
      ? " shadow-form-selected border-yellow hover:border-yellow"
      : "") +
    (errorText
      ? " border-error hover:border-error"
      : " border-gray-300 hover:border-gray-400");

  return (
    <Column className={`gap-1 ${className}`}>
      {label && <p className="font-normal text-gray-400">{label}</p>}
      <Row className={borderStyle}>
        {innerElements}
        {innerElements && <div className="mr-2" />}
        <TextareaAutosize
          className={"flex flex-grow max-w-full focus:outline-none " + className}
          {...rest}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              onEnterKeyPressed?.();
            }
            rest.onKeyDown?.(e);
          }}
        />
      </Row>

    </Column>

  );
}
