import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Row from "../../components/layout/Row";
import { Constants, MutationKeys, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Journal } from "../../data/models/Journal";
import { formatDate } from "../../utils";
import PrivateEntryCard from "./PrivateEntryCard";
import ScrollableJournalCalendar from "./ScrollableJournalCalendar";

export default function PrivateEntriesView() {
  const [selectedEntry, setSelectedEntry] = useState<Journal | undefined>(
    undefined,
  );
  const { user } = useUser();
  const [networkingState, setNetworkingState] = useState(
    Constants.FINISHED_MUTATION_TEXT,
  );
  const journalUpdateTimeout = useRef<number | undefined>();
  const { api } = useApi();
  const queryClient = useQueryClient();

  const journalMutation = useMutation({
    mutationFn: (newJournal: Journal) =>
      api.post(
        "/journal/",
        {
          data: newJournal.data,
          timestamp: newJournal.timestamp,
        },
        {
          headers: {
            "Password-Key": sessionStorage.getItem(Constants.PASSWORD_KEY),
          },
        },
      ),
    mutationKey: [MutationKeys.MUTATE_JOURNAL],
    onSuccess: () => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      /* 
      TODO in the future we can use set queries data to make the editing
      experience smoother, but this introduces a lot of complexity with the
      update function and how we are going to efficiently update infinite query
      data. I will leave this as a task for after launch.
      */
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FETCH_JOURNAL] });
    },
    onError: () => {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
    },
  });
  const journalDeletion = useMutation({
    mutationFn: (id: number) => api.delete(`/journal/?id=${id}`),
    onSuccess: () => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FETCH_JOURNAL] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FETCH_JOURNAL_COUNT],
      });
    },
    onError: () => {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
    },
  });

  const updateJournal = () => {
    if (selectedEntry && selectedEntry.data.trim() !== "") {
      journalMutation.mutate(selectedEntry);
    } else if (selectedEntry && selectedEntry.id > 0) {
      journalDeletion.mutate(selectedEntry.id);
    } else setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
  };

  useEffect(() => {
    setNetworkingState(Constants.LOADING_MUTATION_TEXT);
    clearTimeout(journalUpdateTimeout.current);
    journalUpdateTimeout.current = setTimeout(updateJournal, 1000);
  }, [selectedEntry]);

  window.onbeforeunload = () => {
    if (networkingState === Constants.LOADING_MUTATION_TEXT) {
      return "Still saving entry, are you sure you want to leave?";
    }
  };

  return (
    <Row className="h-screen bg-[#FAFAFA]">
      <div className="h-full pt-6">
        <ScrollableJournalCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      </div>
      <div className="h-full w-full py-8 pr-8">
        <PrivateEntryCard
          journal={
            selectedEntry ?? {
              user_id: user!.id,
              data: "",
              timestamp: formatDate(new Date()),
              id: -1,
            }
          }
          onChangeJournalText={(text) =>
            setSelectedEntry((entry) => {
              return entry ? { ...entry, data: text } : undefined;
            })
          }
          networkingState={networkingState}
          setNetworkingState={() => {}}
        />
      </div>
    </Row>
  );
}
