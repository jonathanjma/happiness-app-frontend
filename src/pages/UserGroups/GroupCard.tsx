import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Row from "../../components/layout/Row";
import { Group } from "../../data/models/Group";

export default function GroupCard({
  groupData,
  onAccept,
  onDecline,
  acceptButtonIcon,
  declineButtonIcon,
}: {
  groupData: Group;
  onAccept?: () => void;
  onDecline?: () => void;
  acceptButtonIcon?: React.ReactElement;
  declineButtonIcon?: React.ReactElement;
}) {
  const navigate = useNavigate();
  const acceptDenyButtonClass =
    "flex justify-center flex-grow rounded-lg border border-gray-100 bg-brand_off_white py-3 text-sm font-semibold shadow-md2";

  return (
    <Card className="border-yellow bg-light_yellow">
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
        {!onAccept && (
          <button
            className="w-full rounded-lg border border-gray-100 bg-brand_off_white py-3 text-sm font-semibold text-secondary shadow-md2"
            onClick={() => navigate("/groups/" + groupData.id)}
          >
            Open
          </button>
        )}
        {onAccept && (
          <Row className="w-full justify-stretch gap-4">
            <button
              className={acceptDenyButtonClass + " text-secondary"}
              onClick={onAccept}
            >
              {acceptButtonIcon}
              {acceptButtonIcon && <div className="w-4" />}
              Accept
            </button>
            <button
              className={acceptDenyButtonClass + " text-error"}
              onClick={onDecline}
            >
              {declineButtonIcon}
              {declineButtonIcon && <div className="w-4" />}
              Decline
            </button>
          </Row>
        )}
      </div>
    </Card>
  );
}
