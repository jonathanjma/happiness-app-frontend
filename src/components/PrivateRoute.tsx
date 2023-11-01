import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  let { user } = useUser();

  if (user === undefined) {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/" state={{ next: url }} />;
  } else {
    return children;
  }
}
