import { Navigate } from "react-router-dom";
import useUser from "../data/repositories/UserRepositoryImpl";

export default function PublicRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { getSelf } = useUser();
  const user = getSelf();

  if (user.isLoading) {
    return <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>;
  } else if (user.isSuccess) {
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
