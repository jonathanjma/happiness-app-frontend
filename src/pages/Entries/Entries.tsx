import { useEffect, useRef, useState } from "react";
import { useIsMutating, useMutation, useQueries, useQuery } from "react-query";
import Row from "../../components/layout/Row";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness, HappinessPost } from "../../data/models/Happiness";
import EntryCard from "./EntryCard";
import ScrollableCalendar from "./ScrollableCalendar";
import { shouldProcessLinkClick } from "react-router-dom/dist/dom";

/**
 * The page for displaying entries with the scrollable calendar
 */
export default function Entries() {
  const [selectedEntry, setSelectedEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [editing, setEditing] = useState(false);
  const prevSelectedEntryId = useRef<number | undefined>(undefined);
  const { user } = useUser();
  const { api } = useApi();
  const numStillMutating = useIsMutating();
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
    if (
      selectedEntry &&
      prevSelectedEntryId &&
      prevSelectedEntryId.current &&
      prevSelectedEntryId.current !== selectedEntry?.id &&
      selectedEntry.value !== -1
    ) {
      setEditing(false);
    }
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
    mutationKey: "updateHappiness",
  });

  const deleteHappinessMutation = useMutation({
    mutationFn: () =>
      api.delete(`/happiness/?id=${selectedEntry?.id}`),
    mutationKey: "deleteHappiness"
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
    if (updateEntryMutation.isLoading) {
      setNetworkingState(Constants.LOADING_MUTATION_TEXT);
      return;
    }
    if (updateEntryMutation.isError) {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
      return;
    }
    setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
  }, [numStillMutating]);

  // Update happiness when it is successfully deleted
  useEffect(() => {
    console.log(`delete status: ${deleteHappinessMutation.status}`);
    if (deleteHappinessMutation.isSuccess) {
      setSelectedEntry((selected) => {
        return selected ? { ...selected, comment: "", value: -1 } : undefined;
      });
    }
  }, [deleteHappinessMutation]);

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
              author: user!,
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
