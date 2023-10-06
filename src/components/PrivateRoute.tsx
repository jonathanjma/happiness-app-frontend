import { Navigate, useLocation } from "react-router-dom";
import { useRepo } from "../contexts/RepoProvider";
import { useUser } from "../contexts/UserProvider";
import { PropsWithChildren, ReactNode } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useUser();
  const location = useLocation();

  if (user.isLoading) {
    return null;
  } else if (user.isSuccess) {
    return children;
  } else {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/" state={{ next: url }} />;
  }
}
