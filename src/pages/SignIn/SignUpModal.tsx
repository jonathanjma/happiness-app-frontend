import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";

export default function SignUpModal({ id }: { id: string; }) {
  return (
    <ClosableModal id={id} leftContent={<h4>Sign Up</h4>}>
      <Row className="w-[500px]">

      </Row>
    </ClosableModal>
  );
}

