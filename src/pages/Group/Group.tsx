import React from "react";
import { useState, useEffect } from "react";
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
import GroupStatistics from "./GroupStatistics";
import GroupSettings from "./GroupSettings";

export default function GroupPage() {
  const { groupID } = useParams();
  const { api } = useApi();
  const { isLoading, data, isError } = useQuery<Group>(
    [QueryKeys.FETCH_GROUP_INFO, groupID],
    () =>
      api.get<Group>("/group/" + groupID).then((res) => {
        res.data.users.sort((a, b) => a.id - b.id);
        res.data.invited_users.sort((a, b) => a.id - b.id);
        return res.data;
      }),
  );

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [radioValue, setRadioValue] = useState(1);

  // Changes selected date range between current week and current month when radioValue variable changes.
  useEffect(() => {
    setStartDate(() => {
      if (radioValue === 1) {
        return new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() - startDate.getDay(),
        );
      } else {
        return new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      }
    });
    setEndDate(() => {
      if (radioValue === 1) {
        return new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() - startDate.getDay() + 6,
        );
      } else {
        return new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      }
    });
  }, [radioValue]);
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
          <div className="mx-8 my-6 overflow-auto">
            <GroupStatistics
              groupData={data!}
              radioValue={radioValue}
              setRadioValue={setRadioValue}
              startDate={startDate}
              endDate={endDate}
              setCurDates={[setStartDate, setEndDate]}
            />
          </div>
        </TabPanel>
        <TabPanel index={3}>
          <div className="mx-8 my-6 overflow-auto">
            <HappinessTable
              group={data!}
              radioValue={radioValue}
              setRadioValue={setRadioValue}
              startDate={startDate}
              endDate={endDate}
              setCurDates={[setStartDate, setEndDate]}
            />
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
