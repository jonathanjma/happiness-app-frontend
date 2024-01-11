import { useState } from "react";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";

export default function LoginModal({ id }: { id: string; }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ClosableModal
      leftContent={<h4>Log In</h4>}
      id={id}
    >
      <Row className="gap-1 my-4 w-[500px]">
        <p>Don't have an account?</p>
        <p className="text-secondary underline hover:cursor-pointer" onClick={
          () => {
            console.log(`TODO open create account modal`);
          }}>
          Create an account
        </p>
      </Row>
      <div className="bg-gray-100 h-[1px] w-full" />
      <div className="h-6" />
      <TextArea
        title="Username"
        value={username}
        onChangeValue={setUsername}
      />
      <div className="h-4" />
      <TextArea
        title="Password:"
        value={password}
        onChangeValue={setPassword}
        type="password"
      />
      <div className="h-6" />
      <Row className="gap-4">
        <Button label="Log In" size="LARGE" />
        <Button label="Forgot password?" variation="TEXT" />
      </Row>
    </ClosableModal>
  );
}
