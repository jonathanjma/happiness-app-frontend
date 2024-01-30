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

export default function ResetPassword() {
  const { api } = useApi();
  const navigate = useNavigate();
  const resetToken = new URLSearchParams(useLocation().search).get("token");

  const [password, setPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(true);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

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
      }),
    onSuccess: () => {
      navigate("/");
      toast.custom(<ToastMessage message="✅ Password has been reset" />);
    },
    onError: () => {
      setError("Token is invalid. Please request another reset email.");
    },
  });

  const handlePasswordReset = () => {
    setTriedToSubmit(true);

    if (!hasPasswordError) {
      resetPassword.mutate();
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
