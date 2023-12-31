import { Group } from "../../data/models/Group";
import Spinner from "../../components/Spinner";
import { useApi } from "../../contexts/ApiProvider";
import { useQuery } from "react-query";
import { QueryKeys } from "../../constants";
import { Happiness } from "../../data/models/Happiness";
import FeedCard from "./FeedCard";
import HappinessViewerModal from "../../components/modals/HappinessViewerModal";
import { useState } from "react";

export default function GroupFeed({ groupData }: { groupData: Group }) {
  const { api } = useApi();
  const [selectedEntry, setSelectedEntry] = useState<Happiness>();

  // placeholder query
  const { isLoading, data, isError } = useQuery<Happiness[]>(
    QueryKeys.FETCH_GROUP_HAPPINESS,
    () =>
      api
        .get<Happiness[]>("/group/" + groupData.id + "/happiness", {
          start: "2023-12-20",
        })
        .then((res) =>
          res.data.sort(
            // reverse sort
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          ),
        ),
  );

  return (
    <div className="mx-8">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isError ? (
            <h5 className="text-gray-400">Error: Could not load entries.</h5>
          ) : (
            <>
              {data!.length === 0 ? (
                <h5 className="text-gray-400">No entries yet!</h5>
              ) : (
                <>
                  {data!.map((entry) => (
                    <FeedCard
                      key={entry.id}
                      data={entry}
                      isNew={true}
                      onClick={() => setSelectedEntry(entry)}
                    />
                  ))}
                </>
              )}
              {selectedEntry && (
                <HappinessViewerModal
                  happiness={selectedEntry}
                  id="happiness-viewer"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
