import Row from "../../components/layout/Row";
import { useUser } from "../../contexts/UserProvider";
import Column from "../../components/layout/Column";
import Button from "../../components/Button";
import { TabButton, TabPanel } from "../../components/Tabs";
import PostIcon from "../../assets/post.svg";
import GraphIcon from "../../assets/graph.svg";
import TableIcon from "../../assets/table.svg";
import TimelinePanel from "./TimelinePanel";

export default function Profile() {
  const { user } = useUser();

  return (
    <Row className="mt-16 justify-center">
      <div className="xl:w-2/3">
        <div className="mx-8">
          <Row className="mb-6 gap-x-6">
            <img
              className="min-h-[96px] min-w-[96px] rounded-full"
              src={user!.profile_picture}
              alt="profile"
            />
            <Column className="gap-y-1">
              <h2>{user!.username}</h2>
              <p className="font-normal text-gray-600">
                {"Groups: 1 | Entries: 100"}
              </p>
              <p className="font-normal text-gray-600">
                {"Member Since: " +
                  new Date(user!.created).toLocaleString("en-us", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
              </p>
            </Column>
            <div className="flex-grow"></div>
            <Button label="Change Photo" variation="FILLED" />
          </Row>
          <div>
            <nav aria-label="Tabs" role="tablist">
              <TabButton index={1} icon={PostIcon} title="TIMELINE" />
              <TabButton index={2} icon={TableIcon} title="CALENDAR" />
              <TabButton index={3} icon={GraphIcon} title="GRAPH" />
            </nav>
          </div>
        </div>
        <div className="feed_height2">
          <TabPanel index={1}>
            <TimelinePanel userId={user!.id} />
          </TabPanel>
          <TabPanel index={2}>
            <p>Calendar View</p>
          </TabPanel>
          <TabPanel index={3}>
            <p>Graph View</p>
          </TabPanel>
        </div>
      </div>
    </Row>
  );
}
