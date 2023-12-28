import { useState } from "react";
import TextArea from "../../components/TextArea";
export default function SearchBar() {
  const [text, setText] = useState("");
  return (
    <div>

      <TextArea value={text} onChangeValue={setText} />
    </div>
  );
}
