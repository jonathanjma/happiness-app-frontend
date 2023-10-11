import ScrollableCalendar from "./ScrollableCalendar";
import EntryWidget from "./EntryWidget";
import { useState } from "react";
import { Happiness } from "../../data/models/Happiness";
import Spinner from "../../components/Spinner";

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
