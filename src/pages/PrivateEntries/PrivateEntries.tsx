import IconWarningOutline from "../../assets/IconWarningOutline";
import TextField from "../../components/TextField";
import { useState } from "react";

export default function PrivateEntries() {
  const [passwordText, setPasswordText] = useState("");

  return (
    <div className="w-full h-full p-20">
      <TextField
        title="my special text"
        innerIcon={<IconWarningOutline />}
        supportingText="yes so speical"
        value={passwordText}
        onChangeValue={setPasswordText}
        supportingIcon={<IconWarningOutline />}
      />
    </div>
  );
}
