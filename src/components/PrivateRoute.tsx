import { Navigate } from "react-router-dom";
import { UserState, useUser } from "../contexts/UserProvider";

// Wraps routes that require the user to be logged in
// If the user is logged in, the page is shown, otherwise they are redirected to the login page
export default function PrivateRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  let { state } = useUser();

  if (state === UserState.Loading) {
    return null;
  } else if (state === UserState.Success) {
    return children;
  } else {
    // UserState.Error
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/" state={{ next: url }} />;
  }
}
