import { useState } from "react";
import Toggle from "../../components/Toggle";
import { useUser } from "../../contexts/UserProvider";

export default function UserSettings() {
  const [toggled, setToggled] = useState(false);
  const { user } = useUser();

  return (
    <div>
      <p>hello world</p>
      <Toggle
        toggled={toggled}
        onToggle={(toggled) => {
          setToggled(!toggled);
        }}
      />
    </div>
  );
}
