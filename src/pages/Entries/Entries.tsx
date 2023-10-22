import { useEffect, useState } from "react";
import Row from "../../components/layout/Row";
import { useUser } from "../../contexts/UserProvider";
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

  useEffect(() => {
    console.log(selectedEntry?.timestamp);
  }, [selectedEntry]);

  return (
    <Row className="h-screen">
      <div className="min-w-[162px] w-[162px]">
        <ScrollableCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      </div>
      <div className=" px-8 pt-8 pb-4 h-full">
        <EntryCard
          happiness={
            selectedEntry ?? {
              id: 1,
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
          className="max-h-[100%]"
        />
      </div>
    </Row>
  );
}
