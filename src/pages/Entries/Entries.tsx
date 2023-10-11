import { useUser } from "../../contexts/UserProvider";
import ScrollableCalendar from "./ScrollableCalendar";

export default function Entries() {
  const { user } = useUser();

  return <ScrollableCalendar></ScrollableCalendar>;
}
