import { useNavigate } from "react-router-dom";
import { Group } from "../../data/models/Group";
import Card from "../../components/Card";

export default function GroupCard({ groupData }: { groupData: Group }) {
  const navigate = useNavigate();

  return (
    <Card className="border-yellow2 bg-light_yellow shadow-sm1">
      <div className="p-6">
        <div className="mb-6 flex justify-between">
          {/* Group metadata */}
          <div>
            <p className="text-sm font-normal text-secondary">
              {groupData.users.length} members
            </p>
            <p className="text-3xl font-semibold text-secondary">
              {groupData.name}
            </p>
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
        </div>
        {/* Open group button */}
        <button
          className="w-full rounded-lg border border-gray-100 bg-brand_off_white py-3 text-sm font-semibold text-secondary shadow-sm1"
          onClick={() => navigate("/groups/" + groupData.id)}
        >
          Open
        </button>
      </div>
    </Card>
  );
}
