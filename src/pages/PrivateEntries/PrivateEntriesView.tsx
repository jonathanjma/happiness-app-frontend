import { useState } from "react";
import Row from "../../components/layout/Row";
import { useUser } from "../../contexts/UserProvider";
import { Journal } from "../../data/models/Journal";
import PrivateEntryCard from "./PrivateEntryCard";
import ScrollableJournalCalendar from "./ScrollableJournalCalendar";

export default function PrivateEntriesView() {
  const [selectedEntry, setSelectedEntry] = useState<Journal | undefined>(undefined);
  const { user } = useUser();
  const [editing, setEditing] = useState(false);

  return (
    <Row className="h-screen bg-[#FAFAFA]">
      <div className="pt-6 h-full">
        <ScrollableJournalCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          setEditing={setEditing}
        />
      </div>
      <div className="py-8 pr-8 h-full w-full">
        <PrivateEntryCard
          journal={selectedEntry ?? {
            user_id: user!.id,
            data: "",
            timestamp: new Date().toDateString(),
            id: -1,
          }}
          onChangeJournalText={() => { }}
          onDeleteJournal={() => { }}
          networkingState="Updated"
          setNetworkingState={() => { }}
        />
      </div>
    </Row>
  );
}
