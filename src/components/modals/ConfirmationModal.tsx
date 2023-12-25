import Modal from "./Modal";
import Row from "../layout/Row";
import Button from "../Button";

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
      {subtitle && <p className="font-subtitle-2 leading-6"> {subtitle} </p>}
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
