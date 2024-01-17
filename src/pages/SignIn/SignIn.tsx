import Button from "../../components/Button";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function SignIn({ signUp }: { signUp: boolean }) {
  const openLogin = () => {
    window.HSOverlay.open(document.querySelector("#login-modal"));
  };

  const openSignUp = () => {
    window.HSOverlay.open(document.querySelector("#sign-up-modal"));
  };

  const openForgotPassword = () => {
    window.HSOverlay.open(document.querySelector("#forgot-pass-modal"));
  };

  return (
    <div>
      {signUp ? (
        <Button
          label="Get Started"
          associatedModalId="sign-in-modal"
          onClick={openSignUp}
          variation="FILLED"
        />
      ) : (
        <Button
          label="Log In"
          associatedModalId="login-modal"
          onClick={openLogin}
          variation="TEXT"
        />
      )}
      <ForgotPasswordModal id="forgot-pass-modal" onLoginClick={openLogin} />
      <SignUpModal id="sign-up-modal" onLoginClick={openLogin} />
      <LoginModal
        id="login-modal"
        onCreateAccountClick={openSignUp}
        onForgotPassword={openForgotPassword}
      />
    </div>
  );
}
