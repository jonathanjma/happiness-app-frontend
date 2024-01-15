import * as EmailValidator from "email-validator";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextArea from "../../components/TextArea";
import Row from "../../components/layout/Row";
import ClosableModal from "../../components/modals/ClosableModal";
import { useApi } from "../../contexts/ApiProvider";
import { useOnline } from "../../utils";

export default function ForgotPasswordModal({ id, onLoginClick }: {
  id: string;
  onLoginClick: () => void;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { api } = useApi();
  const isOnline = useOnline();

  const requestEmail = useMutation({
    mutationFn: () => api.post<{ email: string; }>("/user/initiate_password_reset/", {
      email: email
    }),
    onSuccess: () => {
      console.log(`TODO toast once Jonathan's PR is merged`);
    },
    onError: () => {
      if (isOnline) {
        setEmailError("Email is not recognized");
      } else {
        setEmailError("Check your internet connection");
      }
    }
  });
  const handlePasswordReset = () => {
    if (EmailValidator.validate(email)) {
      requestEmail.mutate();
    } else {
      setEmailError("Invalid email.");
    }
  };

  useEffect(() => {
    setEmailError("");
  }, [email]);

  return (
    <ClosableModal
      id={id}
      leftContent={<h4>Forgot password</h4>}
    >
      <div className=" bg-gray-100 w-[436px] h-[1px] mt-4 mb-6" />
      <TextArea
        value={email}
        onChangeValue={setEmail}
        title="Enter your email"
        onEnterPressed={handlePasswordReset}
        errorText={emailError}
        hasError={emailError !== ""}
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
          onClick={onLoginClick}
          variation="TEXT"
        />
      </Row>
    </ClosableModal>
  );
}
