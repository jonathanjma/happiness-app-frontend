import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import Row from "../../components/layout/Row";
import { Constants, MutationKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Journal } from "../../data/models/Journal";
import { formatDate } from "../../utils";
import PrivateEntryCard from "./PrivateEntryCard";
import ScrollableJournalCalendar from "./ScrollableJournalCalendar";

export default function PrivateEntriesView() {
  const [selectedEntry, setSelectedEntry] = useState<Journal | undefined>(undefined);
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [networkingState, setNetworkingState] = useState(Constants.FINISHED_MUTATION_TEXT);
  const journalUpdateTimeout = useRef<number | undefined>();
  const { api } = useApi();

  const journalMutation = useMutation({
    mutationFn: (newJournal: Journal) =>
      api.post(`/journal/`, {
        data: newJournal.data,
        timestamp: newJournal.timestamp
      }, {
        headers:
        {
          "Password-Key": sessionStorage.getItem(Constants.PASSWORD_KEY)
        }
      }),
    mutationKey: [MutationKeys.MUTATE_JOURNAL],
    onSuccess: () => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
    },
    onError: () => {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
    }
  });

  const updateJournal = () => {
    if (selectedEntry) journalMutation.mutate(selectedEntry);
    else setNetworkingState(Constants.ERROR_MUTATION_TEXT);
  };

  useEffect(() => {
    if (selectedEntry?.data.length && selectedEntry?.data.length > 0) {
      setNetworkingState(Constants.LOADING_MUTATION_TEXT);
      clearTimeout(journalUpdateTimeout.current);
      journalUpdateTimeout.current = setTimeout(updateJournal, 1000);
    }
  }, [selectedEntry]);

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
            timestamp: formatDate(new Date()),
            id: -1,
          }}
          onChangeJournalText={(text) =>
            setSelectedEntry((entry) => { return entry ? { ...entry, data: text } : undefined; })
          }
          networkingState={networkingState}
          setNetworkingState={() => { }}
        />
      </div>
    </Row>
  );
}
