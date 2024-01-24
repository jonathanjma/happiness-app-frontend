import Button from "../Button";
import Row from "../layout/Row";
import Modal from "./Modal";

interface ConfirmationModalProps {
  title: string;
  subtitle?: string;
  body: string;
  denyText: string;
  confirmText: string;
  onConfirm: () => void;
  onDeny?: () => void;
  id: string;
}

export default function ConfirmationModal({
  title,
  subtitle = undefined,
  body,
  denyText,
  confirmText,
  onConfirm,
  onDeny = () => {},
  id,
}: ConfirmationModalProps) {
  return (
    <Modal id={id}>
      <h3>{title}</h3>
      {subtitle && (
        <label className="leading-6 text-gray-400">{subtitle}</label>
      )}
      <div className="h-6" />
      <p> {body} </p>
      <div className="h-6" />
      <Row>
        <div className="flex flex-grow" />
        <Button
          associatedModalId={id}
          variation="TEXT"
          label={denyText}
          onClick={onDeny}
        />
        <div className="w-4" />
        <Button
          associatedModalId={id}
          label={confirmText}
          onClick={onConfirm}
        />
      </Row>
    </Modal>
  );
}
