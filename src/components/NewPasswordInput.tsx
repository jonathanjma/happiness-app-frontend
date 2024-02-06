import { useEffect, useState } from "react";
import IconCheck from "../assets/IconCheck";
import IconWarningOutline from "../assets/IconWarningOutline";
import TextField from "./TextField";
import Column from "./layout/Column";
import Row from "./layout/Row";

export default function NewPasswordInput({
  hasPasswordError,
  setPasswordError,
  triedSubmit,
  password,
  setPassword,
  label = "Password",
}: {
  hasPasswordError: boolean;
  setPasswordError: React.Dispatch<React.SetStateAction<boolean>>;
  triedSubmit: boolean;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
}) {
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  const Requirement = ({ met, message }: { met: boolean; message: string }) => (
    <Row className="items-center gap-1">
      {met ? <IconCheck /> : <IconWarningOutline color="#EC7070" />}
      <p className={met ? "text-green" : "text-error"}>{message}</p>
    </Row>
  );

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setIsLongEnough(password.length >= 8);

    const numberRegex = /[0-9]/;
    setHasNumber(numberRegex.test(password));

    const uppercaseRegex = /[A-Z]/;
    setHasUppercase(uppercaseRegex.test(password));

    // can't trust the use state values on this render
    setPasswordError(
      !uppercaseRegex.test(password) ||
        !numberRegex.test(password) ||
        password.length < 8,
    );
  }, [password]);
  return (
    <Column>
      <TextField
        label={label}
        value={password}
        onChangeValue={setPassword}
        type="password"
        autocomplete="new-password"
      />
      {triedSubmit && (
        <>
          <p className={hasPasswordError ? "text-error" : "text-green"}>
            {hasPasswordError
              ? "Your password does not meet one of the following:"
              : "Your password meets all of the following:"}
          </p>
          <Column className="mt-1 gap-1">
            <Requirement
              met={isLongEnough}
              message="Password must be at least 8 characters long"
            />
            <Requirement
              met={hasUppercase}
              message="Password must contain at least 1 uppercase letter"
            />
            <Requirement
              met={hasNumber}
              message="Password must contain at least 1 number"
            />
          </Column>
        </>
      )}
    </Column>
  );
}
