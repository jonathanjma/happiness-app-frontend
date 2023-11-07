/**
 * Generic TextArea component for use for Happiness App
 * @param value text area content
 * @param onChangeValue action when the value changes
 * @param className style to default to if editingStyle, disabledStyle, or emptyStyle is null
 * @param disabledStyle style to use whenever the textarea is disabled
 * @param emptyStyle style to use when text field content is empty but the text field is not disabled
 * @param editingStyle style to use when the text field is not disabled and not empty
 * @param enabled a boolean value representing whether the textarea is enabled
 * @returns TextArea component
 */
export default function TextArea({
  value,
  onChangeValue,
  className,
  editingStyle,
  disabledStyle,
  emptyStyle,
  enabled = true,
  placeholder,
}: {
  value: string;
  onChangeValue: (s: string) => void;
  className?: string;
  editingStyle?: string;
  disabledStyle?: string;
  emptyStyle?: string;
  enabled?: boolean;
  placeholder?: string;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      className={
        !enabled
          ? disabledStyle ?? className
          : value === ""
          ? emptyStyle ?? className
          : editingStyle ?? className
      }
      disabled={!enabled}
    />
  );
}
