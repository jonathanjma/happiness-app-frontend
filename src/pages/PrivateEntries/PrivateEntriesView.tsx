import { useState } from "react";
import Row from "../../components/layout/Row";
import EntryPreviewCard from "./EntryPreviewCard";
import PrivateEntryCard from "./PrivateEntryCard";
import { Journal } from "../../data/models/Journal";
import { useUser } from "../../contexts/UserProvider";
import ScrollableJournalCalendar from "./ScrollableJournalCalendar";

export default function PrivateEntriesView() {
  const [selectedEntry, setSelectedEntry] = useState<Journal | undefined>(undefined);
  const { user } = useUser();


  return (
    <Row className="p-8 h-full">
      <ScrollableJournalCalendar
        selectedEntry={selectedEntry}
        setSelectedEntry={setSelectedEntry}
      />
      <div className="w-8" />
      <PrivateEntryCard
        journal={selectedEntry ?? {
          user_id: user!.id,
          data: "",
          timestamp: new Date().toDateString(),
          id: -1,
        }}
        onChangeJournalText={() => { }}
        onDeleteJournal={() => { }}
        editing={true}
        setEditing={() => { }}
        networkingState="Updated"
        setNetworkingState={() => { }}
      />
    </Row>
  );
}
