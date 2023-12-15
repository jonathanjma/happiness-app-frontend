import PrivateEntryCard from "./PrivateEntryCard";

export default function PrivateEntriesView() {
  return (
    <div>
      <PrivateEntryCard
        journal={{
          id: 1,
          user_id: 1,
          data: "Hello",
          timestamp: new Date().toDateString(),
        }}
        onChangeJournalText={() => {}}
        onDeleteJournal={() => {}}
        editing={true}
        setEditing={() => {}}
        networkingState="le"
        setNetworkingState={() => {}}
      />
    </div>
  );
}
