import { Navigate } from "react-router-dom";
import useUser from "../data/repositories/UserRepositoryImpl";

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
