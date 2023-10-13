import ScrollableCalendar from "./ScrollableCalendar";
import EntryWidget from "./EntryWidget";
import { useState } from "react";
import { Happiness } from "../../data/models/Happiness";
import Spinner from "../../components/Spinner";

// The entries page: contains scrollable calendar and widget for viewing the details of each happiness entry
export default function Entries() {
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();

  return (
    <div className="flex flex-row h-screen overflow-hidden ">
      <ScrollableCalendar
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
      />
      {selectedEntry === undefined ? (
        <Spinner />
      ) : (
        <EntryWidget entryData={selectedEntry} />
      )}
    </div>
  );
}
