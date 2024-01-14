import * as EmailValidator from "email-validator";
import { useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextArea from "../../components/TextArea";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { useApi } from "../../contexts/ApiProvider";

export default function ForgotPasswordModal({ id }: { id: string; }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { api } = useApi();

  const requestEmail = useMutation({
    mutationFn: () => api.post<{ email: string; }>("/user/initiate_password_reset/", {
      email: email
    }),
    onSuccess: () => {
      console.log(`TODO toast once Jonathan's PR is merged`);
    }
  });
  const handlePasswordReset = () => {
    if (EmailValidator.validate(email)) {
      requestEmail.mutate();
    } else {
      setEmailError("Invalid email.");
    }
  };

  return (
    <ClosableModal
      id={id}
      leftContent={<h4>Forgot password</h4>}
    >
      <div className=" bg-gray-100 w-full h-[1px] mt-4 mb-6" />
      <TextArea
        value={email}
        onChangeValue={setEmail}
        title="Enter your email"
        onEnterPressed={handlePasswordReset}
      />
      <div className="h-6" />
      <Row className="gap-4">
        <Button
          label="Reset Password"
          onClick={handlePasswordReset}
          icon={requestEmail.isLoading ? <Spinner variaton="SMALL" /> : undefined}
        />
        <Button
          label="Back to Login"
          onClick={() => { console.log("TODO"); }}
          variation="TEXT"
        />
      </Row>
    </ClosableModal>
  );
}
