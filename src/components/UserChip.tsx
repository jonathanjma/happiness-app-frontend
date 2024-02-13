import RemoveIcon from "../assets/close.svg";
import Row from "./layout/Row";
import { SimpleUser } from "../data/models/User";

export default function UserChip({
  user,
  onRemove,
}: {
  user: SimpleUser;
  onRemove: () => void;
}) {
  return (
    <Row className="mb-1 mr-2 items-center gap-x-0.5 rounded-2xl bg-yellow px-[5px] py-[3px]">
      <img src={user.profile_picture} className="max-h-[22px] rounded-full" />
      <p className="pb-0.5 font-normal text-secondary">{user.username}</p>
      <img
        src={RemoveIcon}
        className="max-h-[12px] hover:cursor-pointer"
        onClick={onRemove}
      />
    </Row>
  );
}
