import { useNavigate } from "react-router-dom";
import { Group } from "../../data/models/Group";
import Card from "../../components/Card";
import Row from "../../components/layout/Row";

export default function GroupCard({ groupData }: { groupData: Group }) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-md2 border-yellow bg-light_yellow">
      <div className="p-6">
        <Row className="mb-6 justify-between">
          {/* Group metadata */}
          <div>
            <label className="font-normal text-secondary">
              {groupData.users.length} members
            </label>
            <h2 className="font-semibold text-secondary">{groupData.name}</h2>
          </div>
          {/* Profile pictures for 3 members */}
          <div className="flex -space-x-4 self-center">
            {groupData.users.slice(0, 3).map((user, i) => (
              <img
                key={user.id}
                src={user.profile_picture}
                title={user.username}
                style={{ zIndex: 20 - i * 10 }}
                className={
                  "max-w-[40px] rounded-full ring-[1.25px] ring-light_yellow"
                }
              />
            ))}
          </div>
        </Row>
        {/* Open group button */}
        <button
          className="shadow-md2 w-full rounded-lg border border-gray-100 bg-brand_off_white py-3 text-sm font-semibold text-secondary"
          onClick={() => navigate("/groups/" + groupData.id)}
        >
          Open
        </button>
      </div>
    </Card>
  );
}
