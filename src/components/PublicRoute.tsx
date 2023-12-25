import { Navigate } from "react-router-dom";
import { UserState, useUser } from "../contexts/UserProvider";

// Wraps routes that do not require the user to be logged in
// If the user is not logged in, the page is shown, otherwise they are redirected to the home page
export default function PublicRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { state } = useUser();

  if (state === UserState.Loading) {
    return null;
  } else if (state === UserState.Success) {
    return <Navigate to="/home" />;
  } else {
    // UserState.Error
    return children;
  }
}
