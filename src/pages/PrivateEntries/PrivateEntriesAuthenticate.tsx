import React, { useState } from "react";
import { useMutation } from "react-query";
import IconWarningOutline from "../../assets/IconWarningOutline";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";

export default function PrivateEntriesAuthenticate({
  hasError,
  setHasError,
  setRetry,
}: {
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setRetry: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { api } = useApi();
  const [passwordText, setPasswordText] = useState("");
  const [forgotVisible, setForgotVisible] = useState(false);

  const submitPassword = useMutation({
    mutationFn: () =>
      api.post(
        "/journal/key",
        {
          password: passwordText,
        },
        {
          headers: {
            "Password-Key": "None",
          },
        },
      ),
    onSuccess: (res) => {
      sessionStorage.setItem(
        Constants.PASSWORD_KEY,
        res.headers["password-key"],
      );
      setRetry((r) => !r);
    },
    onError: () => {
      setHasError(true);
      sessionStorage.removeItem(Constants.PASSWORD_KEY);
    },
  });

  return (
    <div className=" ml-24 mt-32  h-full w-full">
      <Column className="h-full w-full gap-6 p-8">
        <Column>
          <h2>Enter Password</h2>
          <p className="text-gray-400">
            Journals are private to you and you only.
          </p>
        </Column>
        <TextField
          label="Password"
          errorText={hasError ? "Please enter the correct password" : ""}
          value={passwordText}
          onChangeValue={(v) => {
            setHasError(false);
            setPasswordText(v);
          }}
          hasError={hasError}
          supportingIcon={
            hasError ? <IconWarningOutline color="#EC7070" /> : undefined
          }
          type="password"
          className="w-[250px]"
        />
        <p className="font-normal text-gray-600">
          First time using Private Journals? <br /> Make sure to set up a
          <b> recovery phrase </b> in Settings in case you forget your password!
        </p>
        <Row>
          <Button
            onClick={() => {
              submitPassword.mutate();
            }}
            label="Enter"
          />
          <Button
            label="Forgot Password?"
            variation="TEXT"
            onClick={() => setForgotVisible(!forgotVisible)}
          />
        </Row>
        <p className="font-normal text-gray-600" hidden={!forgotVisible}>
          If you forgot your password, <b> logout and request </b> a password
          reset.
          <br /> You will then be prompted to enter your
          <b> journal recovery phrase. </b>
        </p>
      </Column>
    </div>
  );
}
