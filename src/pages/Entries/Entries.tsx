import { useEffect, useRef, useState } from "react";
import { useIsMutating, useMutation, useQueryClient } from "react-query";
import Row from "../../components/layout/Row";
import { Constants, MutationKeys, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness, HappinessPost } from "../../data/models/Happiness";
import EntryCard from "./EntryCard";
import ScrollableCalendar from "./ScrollableCalendar";
import { formatDate } from "../../utils";

/**
 * The page for displaying entries with the scrollable calendar
 * append `?date=YYYY-MM-DD` to the URL to jump to a certain date
 */
export default function Entries() {
  const [selectedEntry, setSelectedEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [editing, setEditing] = useState(false);
  const prevSelectedEntryId = useRef<number | undefined>(undefined);
  const { user } = useUser();
  const { api } = useApi();
  const queryClient = useQueryClient();
  const numStillMutating = useIsMutating({
    mutationKey: MutationKeys.MUTATE_HAPPINESS,
  });
  const [networkingState, setNetworkingState] = useState(
    Constants.LOADING_MUTATION_TEXT.toString(),
  );

  const updateHappinessTimeout = useRef<number | undefined>(undefined);
  const updateHappiness = () => {
    //@ts-ignore TODO get rid of user_id field once backend is actually updated
    const { id, author, user_id, ...happinessToPost } = selectedEntry;
    updateEntryMutation.mutate(happinessToPost);
  };

  useEffect(() => {
    if (selectedEntry) {
      if (selectedEntry.value === -1) {
        setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
      } else {
        setNetworkingState(Constants.LOADING_MUTATION_TEXT);
        prevSelectedEntryId.current = selectedEntry.id;
        clearTimeout(updateHappinessTimeout.current);
        updateHappinessTimeout.current = setTimeout(updateHappiness, 1000);
      }
    }
  }, [selectedEntry]);

  // General mutation function for updating Happiness entries
  const updateEntryMutation = useMutation({
    mutationFn: (newHappiness: HappinessPost) => {
      return api.post<Happiness>("/happiness/", newHappiness);
    },
    mutationKey: MutationKeys.MUTATE_HAPPINESS,
  });

  const deleteHappinessMutation = useMutation({
    mutationFn: () => api.delete(`/happiness/?id=${selectedEntry?.id}`),
    mutationKey: MutationKeys.MUTATE_HAPPINESS,
  });

  // Update the networking state displayed to the user based on updateEntryMutation result
  useEffect(() => {
    if (!selectedEntry || selectedEntry.value === -1) {
      setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
      return;
    }
    if (numStillMutating > 0) {
      setNetworkingState(Constants.LOADING_MUTATION_TEXT);
      return;
    }
    if (updateEntryMutation.isError || deleteHappinessMutation.isError) {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
      return;
    }
    setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey.includes(QueryKeys.FETCH_HAPPINESS);
      },
    });
  }, [numStillMutating]);

  // add leave without saving popup
  window.onbeforeunload = () => {
    if (networkingState === Constants.LOADING_MUTATION_TEXT) {
      return Constants.LEAVE_WITHOUT_SAVING;
    }
  };

  return (
    <Row className="h-screen bg-[#FAFAFA]">
      <div className="pt-8">
        <ScrollableCalendar
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          setEditing={setEditing}
        />
      </div>
      <div className="h-full w-full pb-4 pr-8 pt-8">
        <EntryCard
          happiness={
            selectedEntry ?? {
              id: -1,
              value: -1,
              comment: "",
              timestamp: formatDate(new Date()),
              author: user!,
            }
          }
          className="h-full"
          editing={editing}
          onChangeHappinessNumber={(value: number) => {
            setSelectedEntry((selected) =>
              selected ? { ...selected, value: value } : undefined,
            );
          }}
          onChangeCommentText={(text: string) => {
            setSelectedEntry((selected) =>
              selected ? { ...selected, comment: text } : undefined,
            );
          }}
          setEditing={setEditing}
          networkingState={networkingState}
          setNetworkingState={setNetworkingState}
          onDeleteHappiness={() => {
            deleteHappinessMutation.mutate();
          }}
        />
      </div>
    </Row>
  );
}
