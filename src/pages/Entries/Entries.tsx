import { useEffect, useRef, useState } from "react";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import EntryCard from "./EntryCard";
import ScrollableCalendar from "./ScrollableCalendar";

/**
 * The page for displaying entries with the scrollable calendar
 */
export default function Entries() {
  const [selectedEntry, setSelectedEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [editing, setEditing] = useState(false);
  const prevSelectedEntryId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (
      selectedEntry &&
      prevSelectedEntryId &&
      prevSelectedEntryId.current !== selectedEntry?.id
    ) {
      setEditing(false);
    }
    if (selectedEntry) {
      prevSelectedEntryId.current = selectedEntry.id;
    }
  }, [selectedEntry]);

  return (
    <Row className="h-screen bg-[#FAFAFA]">
      <div className="w-[162px] min-w-[162px]">
        <ScrollableCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      </div>
      <div className="h-full w-full px-8 pb-4 pt-8">
        <EntryCard
          happiness={
            selectedEntry ?? {
              id: -1,
              value: -1,
              comment: "",
              timestamp: Date.now().toString(),
              author: {
                id: 1,
                username: "Fiddle01",
                email: "zachary.seidner@gmail.com",
                created: "",
                profilePicture:
                  "https://s3.amazonaws.com/polleverywhere-images/f2f946dad2caa071aba28de1c5da8360d237e7a4af3b622dc2ece8a7f2726700.png",
                settings: [],
              },
            }
          }
          className="h-full"
          editing={editing}
          onChangeHappinessNumber={(value) => {
            setSelectedEntry((selected) => {
              return selected ? { ...selected, value: value } : undefined;
            });
          }}
          onChangeCommentText={(comment) => {
            setSelectedEntry((selected) => {
              return selected ? { ...selected, comment: comment } : undefined;
            });
          }}
          setEditing={setEditing}
        />
      </div>
    </Row>
  );
}
