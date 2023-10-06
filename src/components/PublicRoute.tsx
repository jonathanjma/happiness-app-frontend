import { Navigate } from "react-router-dom";
import { useRepo } from "../contexts/RepoProvider";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { userRepo } = useRepo();
  const userResult = userRepo.getSelf();

  if (userResult.isLoading) {
    return null;
  } else if (userResult.isSuccess) {
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
