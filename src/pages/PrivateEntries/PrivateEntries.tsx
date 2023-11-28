import IconWarningOutline from "../../assets/IconWarningOutline";
import TextField from "../../components/TextField";
import { useState } from "react";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import Button from "../../components/Button";

export default function PrivateEntries() {
  const [passwordText, setPasswordText] = useState("");
  const [hasError, setHasError] = useState(true);

  return (
    <Column className="h-full w-full gap-6 p-20">
      <Column>
        <h2>Enter Password</h2>
        <p className="text-gray-400">
          Journals are private to you and you only.
        </p>
      </Column>
      <TextField
        title="Password:"
        supportingText={hasError ? "Please enter the correct password" : ""}
        value={passwordText}
        onChangeValue={setPasswordText}
        hasError={hasError}
        supportingIcon={
          hasError ? <IconWarningOutline color="#EC7070" /> : undefined
        }
        type="password"
      />
      <Row>
        <Button label="Enter" />
        <Button label="Forgot Password?" variation="TEXT" />
      </Row>
    </Column>
  );
}
