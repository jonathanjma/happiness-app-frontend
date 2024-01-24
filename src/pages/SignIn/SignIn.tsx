import Button from "../../components/Button";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function SignIn() {
  const openLogin = () => {
    //@ts-ignore
    window.HSOverlay.open(document.querySelector("#login-modal"));
  };

  const openSignUp = () => {
    // @ts-ignore
    window.HSOverlay.open(document.querySelector("#sign-up-modal"));
  };

  const openForgotPassword = () => {
    // @ts-ignore
    window.HSOverlay.open(document.querySelector("#forgot-pass-modal"));
  };

  return (
    <div className="m-8">
      <Button
        label="Get Started"
        associatedModalId="sign-in-modal"
        onClick={openSignUp}
      />
      <ForgotPasswordModal
        id="forgot-pass-modal"
        onLoginClick={openLogin}
      />
      <SignUpModal id="sign-up-modal" onLoginClick={openLogin} />
      <LoginModal
        id="login-modal"
        onCreateAccountClick={openSignUp}
        onForgotPassword={openForgotPassword}
      />
    </div>
  );
}
