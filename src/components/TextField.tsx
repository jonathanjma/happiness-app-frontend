import Column from "./layout/Column";
import { useRef } from "react";
import Row from "./layout/Row";
import IconWarningOutline from "../assets/IconWarningOutline";
interface TextFieldProps {
  title?: string,
  type?: string,
  defaultText?: string;
  hint?: string;
  supportingText?: string;
  supportingIcon?: React.ReactElement;
  innerIcon?: React.ReactElement;
  hasError?: boolean;
  setHasError?: React.Dispatch<React.SetStateAction<boolean>>;
  isEnabled?: boolean;
  value: string,
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextField({
  title,
  type = "text",
  defaultText = "",
  hint = "",
  supportingText = "",
  supportingIcon,
  innerIcon,
  hasError = false,
  setHasError,
  isEnabled = true,
  value,
  onChangeValue
}: TextFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  let inputClassName: string = " border-1 border-solid   ";
  if (input.current && document.activeElement === input.current) {
    inputClassName = "";
  }
  if (!isEnabled) {
    inputClassName = "hover:cursor-not-allowed ";
  }

  return (
    <Column className="gap-1 w-[250px]">
      {title && <p className="text-gray-400">{title}</p>}
      <Row className=" items-center">
        <input
          className="border-1 border-solid rounded-lg border-gray-300 hover:border-gray-400 focus:border-yellow focus:shadow-form-selected focus:outline-none px-4"
          ref={input}
          type={type}
          value={value}
          disabled={!isEnabled}
          onChange={(e) => { onChangeValue(e.target.value); }} />
      </Row>
      {(supportingText || supportingIcon) &&
        <Row className="gap-1 items-center">
          {supportingIcon}
          {supportingText && <label className={hasError ? " text-error" : " text-gray-400"}>{supportingText}</label>}
        </Row>
      }
      {/* <div className=" border-1 border-solid rounded-lg border-gray-300 hover:border-gray-400 focus:border-yellow shadow-form-selected"></div> */}
    </Column>
  );
}
