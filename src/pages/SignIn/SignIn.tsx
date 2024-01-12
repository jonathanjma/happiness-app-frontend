import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useUser } from "../../contexts/UserProvider";
import SignUpModal from "./SignUpModal";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useUser();
  useEffect(() => {
    // @ts-ignore
    window.HSOverlay.open(document.querySelector("#sign-in-modal"));
  }, []);
  return (
    <div>
      <p className="text-black">username</p>
      <input type="username" onChange={(e) => setUsername(e.target.value)} />
      <p>Password</p>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button
        className="self-start"
        onClick={() => loginUser(username, password)}
      >
        Log in
      </button>
      <Button label="Open modal" associatedModalId="sign-in-modal" />
      <SignUpModal id="sign-in-modal" />
    </div>
  );
}
