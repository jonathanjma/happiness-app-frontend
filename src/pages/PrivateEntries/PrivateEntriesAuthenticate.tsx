import { useState } from "react";
import IconWarningOutline from "../../assets/IconWarningOutline";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";

export default function PrivateEntriesAuthenticate() {
  const [passwordText, setPasswordText] = useState("");
  const [hasError, setHasError] = useState(false);
  const { api } = useApi();
  const { user } = useUser();
  const onSubmitPassword = async () => {
    console.log(`${user?.username}:${passwordText}`);
    api
      .get(
        "/journal/key",
        {
          password: passwordText
        },
        {
          headers: {
            'Password-Key': "None"
          }
        }
      )
      .then((res) => {
        console.log(`res data ${JSON.stringify(res.data)}`);
        console.log(`res header ${res.headers["Password-Key"]}`);
      });
  };

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
          title="Password:"
          supportingText={hasError ? "Please enter the correct password" : ""}
          value={passwordText}
          onChangeValue={setPasswordText}
          hasError={true}
          supportingIcon={
            hasError ? <IconWarningOutline color="#EC7070" /> : undefined
          }
          type="password"
        />
        <Row>
          <Button onClick={onSubmitPassword} label="Enter" />
          <Button label="Forgot Password?" variation="TEXT" />
        </Row>
      </Column>
    </div>
  );
}
