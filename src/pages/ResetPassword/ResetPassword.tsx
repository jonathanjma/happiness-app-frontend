import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import Button from "../../components/Button";
import NewPasswordInput from "../../components/NewPasswordInput";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import ToastMessage from "../../components/ToastMessage";
import { useApi } from "../../contexts/ApiProvider";
import Spinner from "../../components/Spinner";
import Row from "../../components/layout/Row";
import TextField from "../../components/TextField";

export default function ResetPassword() {
  const { api } = useApi();
  const navigate = useNavigate();
  const resetToken = new URLSearchParams(useLocation().search).get("token");

  const [password, setPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(true);
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  const [recover, setRecover] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    // redirect to home if no token is provided
    if (resetToken) {
      window.HSOverlay.open(document.querySelector("#reset-pass-modal"));
    } else {
      navigate("/");
    }
  }, []);

  const resetPassword = useMutation({
    mutationFn: () =>
      api.post<void>("/user/reset_password/" + resetToken, {
        password: password,
        recovery_phrase: recover ? recoveryPhrase : "",
      }),
    onSuccess: () => {
      navigate("/");
      toast.custom(<ToastMessage message="✅ Password has been reset" />);
    },
    onError: (error: { response: { data: string } }) => {
      const errorMsg = error.response.data;
      if (errorMsg.indexOf("recovery") != -1) {
        setError("Incorrect Recovery Phrase.");
      } else {
        // token related error
        setError("Token is invalid. Please request another reset email.");
      }
    },
  });

  const handlePasswordReset = () => {
    setTriedToSubmit(true);

    if (!hasPasswordError) {
      if (!recover || recoveryPhrase.trim().length > 0) {
        resetPassword.mutate();
      } else {
        setError("Recovery Phrase is empty.");
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-light_yellow">
      <Modal id="reset-pass-modal" className="[--overlay-backdrop:static]">
        <div>
          <h4>Reset Password</h4>
          <div className="mb-6 mt-4 h-[1px] w-[436px] bg-gray-100" />
          <NewPasswordInput
            password={password}
            setPassword={setPassword}
            hasPasswordError={hasPasswordError}
            setPasswordError={setHasPasswordError}
            triedSubmit={triedToSubmit}
            label="New password"
          />
          <Row className="mb-2 mt-4 gap-x-2">
            <input type="checkbox" onChange={() => setRecover(!recover)} />
            <p className="font-normal text-gray-400">
              Recover Journal Entries? (otherwise they will be{" "}
              <b className="text-error">lost</b>)
            </p>
          </Row>
          <div hidden={!recover}>
            <TextField
              label="Recovery Phrase"
              value={recoveryPhrase}
              onChangeValue={setRecoveryPhrase}
              type="password"
              autocomplete="current-password"
            />
          </div>
          <p className="mt-4 text-error">{error}</p>
          <Row className="mt-4 gap-x-4">
            <Button
              label="Reset Password"
              onClick={handlePasswordReset}
              icon={
                resetPassword.isLoading ? (
                  <Spinner variaton="SMALL" />
                ) : undefined
              }
            />
            <Button
              label="Cancel"
              variation="TEXT"
              onClick={() => navigate("/")}
            />
          </Row>
        </div>
      </Modal>
    </div>
  );
}
