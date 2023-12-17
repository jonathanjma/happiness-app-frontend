import Row from "../../components/layout/Row";
import EntryPreviewCard from "./EntryPreviewCard";
import PrivateEntryCard from "./PrivateEntryCard";

export default function PrivateEntriesView() {
  return (
    <Row className="p-8">
      <EntryPreviewCard click={() => { }} selected={false} data={{
        id: 1,
        user_id: 1,
        data: "Hello",
        timestamp: new Date().toDateString(),
      }} />
      <PrivateEntryCard
        journal={{
          id: 1,
          user_id: 1,
          data: "Hello",
          timestamp: new Date().toDateString(),
        }}
        onChangeJournalText={() => { }}
        onDeleteJournal={() => { }}
        editing={true}
        setEditing={() => { }}
        networkingState="le"
        setNetworkingState={() => { }}
      />
    </Row>
  );
}
