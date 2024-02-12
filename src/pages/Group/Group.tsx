import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import GraphIcon from "../../assets/graph.svg";
import PostIcon from "../../assets/post.svg";
import SettingsIcon from "../../assets/settings.svg";
import TableIcon from "../../assets/table.svg";
import BackButton from "../../components/BackButton";
import HappinessTable from "../../components/HappinessTable";
import Spinner from "../../components/Spinner";
import { TabButton, TabPanel } from "../../components/Tabs";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Group } from "../../data/models/Group";
import FeedPanel from "./FeedPanel";
import GroupSettings from "./GroupSettings";

export default function GroupPage() {
  const { groupID } = useParams();
  const { api } = useApi();
  const { isLoading, data, isError } = useQuery<Group>(
    [QueryKeys.FETCH_GROUP_INFO, groupID],
    () => api.get<Group>("/group/" + groupID).then((res) => res.data),
  );
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  if (isLoading) {
    return <Spinner className="mx-8 mt-16" />;
  }
  if (isError) {
    return (
      <p className="mx-8 mt-16 text-gray-400">Error: Could not load group.</p>
    );
  }

  if (showGroupSettings) {
    return (
      <GroupSettings
        group={data!}
        setShowGroupSettings={setShowGroupSettings}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mx-8 h-[220px] pt-16">
        <BackButton
          relativeUrl="/groups"
          text="Back to Groups"
          className="mb-6"
        />
        <Row className="mb-6 w-full justify-between">
          <h2 className="m-0 self-center">{data!.name}</h2>
          <button
            className="rounded-xl border border-secondary px-3 py-2 shadow-md1"
            onClick={() => {
              setShowGroupSettings(true);
            }}
          >
            <img src={SettingsIcon} className="max-w-[24px]" />
          </button>
        </Row>
        {/* Tab Buttons */}
        <div>
          <nav aria-label="Tabs" role="tablist">
            <TabButton index={1} icon={PostIcon} title="FEED" />
            <TabButton index={2} icon={GraphIcon} title="GRAPH" />
            <TabButton index={3} icon={TableIcon} title="TABLE" />
          </nav>
        </div>
      </div>
      {/* Tab Panels */}
      <div className="feed_height">
        <TabPanel index={1}>
          <FeedPanel groupData={data!} />
        </TabPanel>
        <TabPanel index={2}>
          <p>Graph View</p>
        </TabPanel>
        <TabPanel index={3}>
          <div className="m-12  overflow-auto">
            <HappinessTable
              group={data!}
              startDate="2023-12-01"
              endDate="2023-12-31"
            />
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
