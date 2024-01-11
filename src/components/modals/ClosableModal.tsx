import CloseIcon from "../../assets/CloseIcon";
import Row from "../layout/Row";
import Modal from "./Modal";

interface ClosableModalProps {
  id: string,
  leftContent?: React.ReactNode,
}

/**
 * A generic modal with an x button at the top left that can close the modal. 
 * @param leftContent the content to place to the left of the x button
 * @param id the modal id 
 */
export default function ClosableModal({ id, leftContent, children, ...rest }: React.HTMLProps<HTMLDivElement> & ClosableModalProps) {
  return (
    <Modal id={id} {...rest}>
      <Row>
        {leftContent}
        <div className="flex flex-1" />
        <button data-hs-overlay={`#${id}`}>
          <CloseIcon color="#575F68" />
        </button>
      </Row>
      {children}
    </Modal>
  );
}
