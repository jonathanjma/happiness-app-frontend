import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import { Group } from "../../data/models/Group";
import GroupFeed from "./GroupFeed";

// Content for the feed tab panel on the groups page
export default function FeedPanel({ groupData }: { groupData: Group }) {
  return (
    <Row className="h-full gap-x-8 py-4">
      {/* Entry Feed */}
      <Column className="basis-3/5">
        <GroupFeed groupData={groupData} />
      </Column>
      {/* Member List */}
      <Column className="basis-2/5">
        <h5 className="mb-4 text-gray-400">Members</h5>
        {groupData.users.map((user, i) => (
          <Row key={i} className="w-full gap-x-2 py-2">
            <img
              src={user.profile_picture}
              className="max-w-[42px] rounded-full"
            />
            <Column className="justify-center">
              <p className="text-gray-600">{user.username}</p>
            </Column>
          </Row>
        ))}
      </Column>
    </Row>
  );
}
