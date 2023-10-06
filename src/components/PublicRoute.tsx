import { Navigate } from "react-router-dom";
import { useRepo } from "../contexts/RepoProvider";
import { useUser } from "../contexts/UserProvider";

export default function PublicRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useUser();

  if (user.isLoading) {
    return null;
  } else if (user.isSuccess) {
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
