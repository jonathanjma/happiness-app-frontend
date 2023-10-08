import useUser from '../data/repositories/UserRepositoryImpl';

export default function Entries() {
  const { user } = useUser();

  return (
    <div>
      <p className="text-black">{user.data?.username}</p>
      <p className="text-black">{user.data?.email}</p>
      <p className="text-black">{user.data?.created.toDateString()}</p>
      <img src={user.data?.profilePicture}></img>
    </div>
  );
}
