import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Row from "../../components/layout/Row";
import { Constants, QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { useUser } from "../../contexts/UserProvider";
import {
  Happiness,
  HappinessPost,
  InfiniteHappinessPagination,
} from "../../data/models/Happiness";
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
  const [editing, setEditing] = useState(false);
  const prevSelectedEntryId = useRef<number | undefined>(undefined);
  const { user } = useUser();
  const { api } = useApi();
  const queryClient = useQueryClient();
  const [networkingState, setNetworkingState] = useState(
    Constants.FINISHED_MUTATION_TEXT.toString(),
  );

  const updateHappinessTimeout = useRef<number | undefined>(undefined);
  const updateHappiness = () => {
    //@ts-ignore TODO get rid of user_id field once backend is actually updated
    const { id, author, user_id, ...happinessToPost } = selectedEntry;
    updateEntryMutation.mutate(happinessToPost);
  };

  useEffect(() => {
    if (selectedEntry && prevSelectedEntryId.current === selectedEntry.id) {
      if (selectedEntry.value === -1) {
        setNetworkingState(Constants.NO_HAPPINESS_NUMBER);
      } else {
        setNetworkingState(Constants.LOADING_MUTATION_TEXT);
        prevSelectedEntryId.current = selectedEntry.id;
        clearTimeout(updateHappinessTimeout.current);
        updateHappinessTimeout.current = setTimeout(updateHappiness, 500);
      }
    }
    prevSelectedEntryId.current = selectedEntry?.id;
  }, [selectedEntry]);

  // General mutation function for updating Happiness entries
  const updateEntryMutation = useMutation({
    mutationFn: (newHappiness: HappinessPost) =>
      api.post<Happiness>("/happiness/", newHappiness).then((res) => res.data),
    onSuccess: (newHappiness: Happiness) => {
      setNetworkingState(Constants.FINISHED_MUTATION_TEXT);

      // update finite happiness queries
      queryClient.setQueriesData(
        [QueryKeys.FETCH_HAPPINESS],
        (happinesses?: Happiness[]) => {
          if (happinesses) {
            const newHappinesses = happinesses.map((happiness) =>
              happiness.id === newHappiness.id ? newHappiness : happiness,
            );
            if (
              !newHappinesses.find(
                (happiness) => happiness.id === newHappiness.id,
              )
            ) {
              newHappinesses.push(newHappiness);
            }
            return newHappinesses;
          }
          return [];
        },
      );

      // update infinite happiness queries
      queryClient.setQueriesData(
        [QueryKeys.FETCH_INFINITE_HAPPINESS],
        (infiniteHappiness?: InfiniteHappinessPagination) => {
          infiniteHappiness?.pages.forEach((page) => {
            page.data = page.data.map((happiness) =>
              happiness.id === newHappiness.id ? newHappiness : happiness,
            );
          });
          return (
            infiniteHappiness ?? {
              pages: [],
              pageParams: [],
            }
          );
        },
      );
    },
    onError: () => {
      setNetworkingState(Constants.ERROR_MUTATION_TEXT);
    },
  });

  const deleteHappinessMutation = useMutation({
    mutationFn: () => api.delete(`/happiness/?id=${selectedEntry?.id}`),
  });

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
              timestamp: Date.now().toString(),
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
