import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useIsMutating, useMutation, useQueryClient } from "react-query";
import ToastMessage from "../../components/ToastMessage";
import Row from "../../components/layout/Row";
import { Constants, MutationKeys, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import { Happiness, HappinessPost } from "../../data/models/Happiness";
import { addNewHappiness } from "../../data/models/stateUtils";
import { formatDate } from "../../utils";
import EntryCard from "./EntryCard";
import ScrollableCalendar from "./ScrollableCalendar";

/**
 * The page for displaying entries with the scrollable calendar
 * append `?date=YYYY-MM-DD` to the URL to jump to a certain date
 */
export default function Entries() {
  const [selectedEntry, setSelectedEntry] = useState<Happiness | undefined>(
    undefined,
  );
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const abortController = useRef<AbortController>(new AbortController());
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
  const getAbortSignal = () => {
    return abortController.current.signal;
  };

  const updateHappinessTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (selectedEntry) {
      if (selectedEntry.value === -1) {
        setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
      } else {
        if (prevSelectedEntryId.current !== selectedEntry.id) {
          setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
          setComment(selectedEntry.comment);
        }
        prevSelectedEntryId.current = selectedEntry.id;
      }
    }
  }, [selectedEntry]);

  // General mutation function for updating Happiness entries
  const updateEntryMutation = useMutation({
    mutationFn: (newHappiness: HappinessPost) => {
      return api.post<Happiness>("/happiness/", newHappiness, {
        signal: getAbortSignal(),
      });
    },
    mutationKey: MutationKeys.MUTATE_HAPPINESS,
    onSuccess: (response) => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FETCH_HAPPINESS + " sidebar query"],
      });
      setTimeout(() => {
        addNewHappiness(queryClient, response.data);
      }, 500);
    },
    onError: (error: any) => {
      if (error.message !== "canceled") {
        setNetworkingState(Constants.ERROR_MUTATION_TEXT);
      }
    },
  });

  const deleteHappinessMutation = useMutation({
    mutationFn: () => api.delete(`/happiness/?id=${selectedEntry?.id}`),
    mutationKey: MutationKeys.MUTATE_HAPPINESS,
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries([QueryKeys.FETCH_HAPPINESS]);
      queryClient.invalidateQueries([
        QueryKeys.FETCH_HAPPINESS + " sidebar query",
      ]);
    },
    onError: () => {
      toast.custom(<ToastMessage message="❌ Failed to delete entry" />);
    },
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
            abortController.current.abort();
            abortController.current = new AbortController();

            setSelectedEntry((selected) =>
              selected ? { ...selected, value: value } : undefined,
            );
            setNetworkingState(Constants.LOADING_MUTATION_TEXT);
            clearTimeout(updateHappinessTimeout.current);
            if (selectedEntry) {
              updateHappinessTimeout.current = setTimeout(() => {
                updateEntryMutation.mutate({
                  comment: selectedEntry.comment,
                  value: value,
                  timestamp: selectedEntry.timestamp,
                });
              }, 1000);
            }
          }}
          onChangeCommentText={(text: string) => {
            setComment(text);
            setNetworkingState(Constants.LOADING_MUTATION_TEXT);
            abortController.current.abort();
            abortController.current = new AbortController();
            setSelectedEntry((selected) =>
              selected ? { ...selected, comment: text } : undefined,
            );
            clearTimeout(updateHappinessTimeout.current);
            if (selectedEntry) {
              updateHappinessTimeout.current = setTimeout(() => {
                updateEntryMutation.mutate({
                  comment: text,
                  value: selectedEntry.value,
                  timestamp: selectedEntry.timestamp,
                });
              }, 1000);
            }
          }}
          setEditing={setEditing}
          networkingState={networkingState}
          setNetworkingState={setNetworkingState}
          onDeleteHappiness={() => {
            deleteHappinessMutation.mutate();
          }}
          comment={comment}
        />
      </div>
    </Row>
  );
}
