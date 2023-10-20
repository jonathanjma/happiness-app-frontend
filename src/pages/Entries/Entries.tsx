import Column from "../../components/layout/Column";
import { useUser } from "../../contexts/UserProvider";
import EntryCard from "./EntryCard";

/**
 * The page for displaying entries with the scrollable calendar
 */
export default function Entries() {
  const { user } = useUser();

  return (
    <Column className="h-screen">
      <div className=" py-4 px-8 h-full">
        <EntryCard
          happiness={{
            id: 1,
            value: 1,
            comment: "hello",
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
          }}
          className="max-h-[100%]"
        />
      </div>
    </Column>
  );
}
