import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import Button from "../../components/Button";
import NewPasswordInput from "../../components/NewPasswordInput";

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetToken = new URLSearchParams(useLocation().search).get("token");

  const [password, setPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(true);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  useEffect(() => {
    if (resetToken) {
      window.HSOverlay.open(document.querySelector("#reset-pass-modal"));
    } else {
      navigate("/");
    }
  }, []);

  const handlePasswordReset = () => {
    setTriedToSubmit(true);
  };

  return (
    <div>
      <Modal id="reset-pass-modal">
        <div>
          <h4>Reset Password</h4>
          <div className=" mb-6 mt-4 h-[1px] w-[436px] bg-gray-100" />
          <NewPasswordInput
            password={password}
            setPassword={setPassword}
            hasPasswordError={hasPasswordError}
            setPasswordError={setHasPasswordError}
            triedSubmit={triedToSubmit}
            label="New password"
          />
          <div className="h-6" />
          <Button
            label="Reset Password"
            onClick={handlePasswordReset}
            // icon={
            //   requestEmail.isLoading ? <Spinner variaton="SMALL" /> : undefined
            // }
          />
        </div>
      </Modal>
    </div>
  );
}
