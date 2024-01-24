import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import GraphIcon from "../../assets/graph.svg";
import PostIcon from "../../assets/post.svg";
import SettingsIcon from "../../assets/settings.svg";
import TableIcon from "../../assets/table.svg";
import BackButton from "../../components/BackButton";
import HappinessTable from "../../components/HappinessTable";
import Spinner from "../../components/Spinner";
import Row from "../../components/layout/Row";
import { QueryKeys } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import { Group } from "../../data/models/Group";
import FeedPanel from "./FeedPanel";

function TabButton({
  index,
  icon,
  title,
}: {
  index: number;
  icon: string;
  title: string;
}) {
  const tabButtonClasses =
    "hs-tab-active:border-gray-800 hs-tab-active:text-gray-800 inline-flex items-center gap-x-2 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hs-tab-active:font-bold";

  return (
    <button
      type="button"
      className={tabButtonClasses + (index === 1 ? " active" : "")}
      id={"tab-" + index}
      data-hs-tab={"#tab-panel-" + index}
      aria-controls={"tab-panel-" + index}
      role="tab"
    >
      <img src={icon} className="m-1 max-w-[18px]" />
      {title}
    </button>
  );
}

function TabPanel({
  index,
  children,
}: {
  index: number;
  children: React.ReactElement;
}) {
  return (
    <div
      id={"tab-panel-" + index}
      className={"h-full overflow-y-auto " + (index !== 1 ? "hidden" : "")}
      role="tabpanel"
      aria-labelledby={"tab-" + index}
    >
      {children}
    </div>
  );
}

export default function Group() {
  const { groupID } = useParams();
  const { api } = useApi();
  const { isLoading, data, isError } = useQuery<Group>(
    [QueryKeys.FETCH_GROUP_INFO, groupID],
    () => api.get<Group>("/group/" + groupID).then((res) => res.data),
  );

  return (
    <div>
      {isLoading ? (
        <Spinner className="mx-8 mt-16" />
      ) : (
        <>
          {isError ? (
            <p className="mx-8 mt-16 text-gray-400">
              Error: Could not load group.
            </p>
          ) : (
            <>
              {/* Header */}
              <div className="mx-8 h-[220px] pt-16">
                <BackButton
                  relativeUrl="/groups"
                  text="Back to Groups"
                  className="mb-6"
                />
                <Row className="mb-6 w-full justify-between">
                  <h2 className="m-0 self-center font-semibold">
                    {data!.name}
                  </h2>
                  <button className="rounded-xl border border-secondary px-3 py-2 shadow-md1">
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
                      endDate="2023-12-8"
                    />
                  </div>
                </TabPanel>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
