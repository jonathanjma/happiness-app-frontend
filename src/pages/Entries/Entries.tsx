import { useUser } from "../../contexts/UserProvider";
import EntryCard from "./EntryCard";

export default function Entries() {
  const { user } = useUser();

  return (
    <div>
      <p className="text-black">{user!.username}</p>
      <p className="text-black">{user!.email}</p>
      <p className="text-black">{user!.created}</p>
      <img src={user!.profilePicture}></img>
      <EntryCard />
    </div>
  );
}
