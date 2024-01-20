import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Row from "../../components/layout/Row";
import { Constants, MutationKeys, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import {
  InfiniteJournalPagination,
  Journal,
  JournalPagination,
} from "../../data/models/Journal";
import { formatDate } from "../../utils";
import PrivateEntryCard from "./PrivateEntryCard";
import ScrollableJournalCalendar from "./ScrollableJournalCalendar";

export default function PrivateEntriesView() {
  const [selectedEntry, setSelectedEntry] = useState<Journal | undefined>(
    undefined,
  );
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [networkingState, setNetworkingState] = useState(
    Constants.FINISHED_MUTATION_TEXT,
  );
  // prevent initial journal query
  const [isFirstRender, setisFirstRender] = useState(true);
  const journalUpdateTimeout = useRef<number | undefined>();
  const { api } = useApi();
  const queryClient = useQueryClient();

  const journalMutation = useMutation({
    mutationFn: (newJournal: Journal) =>
      api
        .post<Journal>(
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
        )
        .then((res) => res.data),
    mutationKey: [MutationKeys.MUTATE_JOURNAL],
    onSuccess: (journal: Journal) => {
      console.log("success");
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);

      // Update infinite queries:
      queryClient.setQueriesData(
        [QueryKeys.FETCH_INFINITE_JOURNAL],
        (infinitePagination?: InfiniteJournalPagination) => {
          infinitePagination?.pages.forEach((pagination) => {
            if (pagination) {
              pagination.data = pagination.data.map((journalFromPagination) =>
                journalFromPagination.id === journal.id
                  ? journal
                  : journalFromPagination,
              );
              if (
                !pagination.data.find(
                  (journalFromPagination) =>
                    journalFromPagination.id === journal.id,
                )
              ) {
                pagination.data.push(journal);
              }
            }
          });
          return (
            infinitePagination ?? {
              pages: [],
              pageParams: [],
            }
          );
        },
      );

      // Update non-infinite queries
      queryClient.setQueriesData(
        [QueryKeys.FETCH_JOURNAL],
        (journals?: Journal[]) => {
          const newJournals = journals?.map((oldJournal) =>
            oldJournal.id === journal.id ? journal : oldJournal,
          );
          return newJournals ?? [];
        },
      );
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
    if (!isFirstRender) {
      setNetworkingState(Constants.LOADING_MUTATION_TEXT);
      clearTimeout(journalUpdateTimeout.current);
      journalUpdateTimeout.current = setTimeout(updateJournal, 1000);
    } else {
      setisFirstRender(true);
    }
  }, [selectedEntry]);

  return (
    <Row className="h-screen bg-[#FAFAFA]">
      <div className="h-full pt-6">
        <ScrollableJournalCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          setEditing={setEditing}
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
