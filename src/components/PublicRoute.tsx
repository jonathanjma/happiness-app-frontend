import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PublicRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useUser();

  if (user === undefined) {
    return children;
  } else {
    return <Navigate to="/home" />;
  }
}
