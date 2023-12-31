import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";
import { Group } from "../../data/models/Group";

export default function Feed({ groupData }: { groupData: Group }) {
  return (
    <Row className="gap-x-8">
      <Column className="basis-3/5">
        <p className="text-2xl font-medium">Feed</p>
      </Column>
      <Column className="basis-2/5">
        <div className="mb-6 flex w-full justify-between">
          <p className="text-2xl font-medium">Members</p>
          <button className="text rounded-lg border border-secondary px-3 text-sm font-semibold text-secondary">
            Manage
          </button>
        </div>
        {groupData.users.slice(0, 5).map((user, i) => (
          <Row key={i} className="w-full gap-x-2 px-4 py-2">
            <img
              src={user.profile_picture}
              className="max-w-[42px] rounded-full"
            />
            <div>
              <p className="font-medium text-gray-600">{user.username}</p>
              <p className="font-medium text-gray-600">{user.created}</p>
            </div>
          </Row>
        ))}
      </Column>
    </Row>
  );
}
