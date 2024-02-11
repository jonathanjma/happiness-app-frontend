import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import LeftArrowIcon from "../../assets/arrow_left.svg";
import GraphIcon from "../../assets/graph.svg";
import PostIcon from "../../assets/post.svg";
import SettingsIcon from "../../assets/settings.svg";
import TableIcon from "../../assets/table.svg";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import HappinessTable from "../../components/HappinessTable";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import ToastMessage from "../../components/ToastMessage";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Group } from "../../data/models/Group";
import FeedPanel from "./FeedPanel";
import { TabButton, TabPanel } from "../../components/Tabs";

export default function GroupPage() {
  const { groupID } = useParams();
  const { api } = useApi();
  const queryClient = useQueryClient();
  const { isLoading, data, isError } = useQuery<Group>(
    [QueryKeys.FETCH_GROUP_INFO, groupID],
    () => api.get<Group>("/group/" + groupID).then((res) => res.data),
  );

  // group settings:
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [groupNameText, setGroupNameText] = useState("");
  const { mutate: saveGroupName, isLoading: putGroupNameLoading } =
    useMutation<Group>({
      mutationFn: () =>
        api
          .put<Group>(`/group/${data!.id}`, { name: groupNameText })
          .then((res) => res.data),
      onSuccess: (newGroup: Group) => {
        queryClient.setQueryData<Group>(
          [QueryKeys.FETCH_GROUP_INFO, groupID],
          (oldGroup) => newGroup,
        );
        toast.custom(<ToastMessage message="✅ Group Name Changed" />);
      },
    });

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
      <Column className="mx-8 gap-6 pt-16">
        <Row
          className="items-center"
          onClick={() => {
            setShowGroupSettings(false);
          }}
        >
          <img src={LeftArrowIcon} className="max-w-[24px]" />
          <label className="font-normal text-gray-600">Back</label>
        </Row>
        <h2>Group Settings</h2>
        <TextField
          label="Change Group Name:"
          hint={data!.name}
          value={groupNameText}
          onChangeValue={setGroupNameText}
          onEnterPressed={saveGroupName}
          className="md:w-1/2 lg:w-1/3 xl:w-1/4"
        />
        <Button
          label="Save Group Name"
          onClick={saveGroupName}
          icon={putGroupNameLoading ? <Spinner variaton="SMALL" /> : undefined}
          variation="TEXT"
        />
      </Column>
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
          <h2 className="m-0 self-center font-semibold">{data!.name}</h2>
          <button className="rounded-xl border border-secondary px-3 py-2 shadow-md1">
            <img
              src={SettingsIcon}
              className="max-w-[24px]"
              onClick={() => {
                setShowGroupSettings(true);
              }}
            />
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
