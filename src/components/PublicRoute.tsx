import { Navigate } from "react-router-dom";
import { useRepo } from "../contexts/RepoProvider";
import React from "react";

export default function PublicRoute({
  children,
}: {
  children: React.ReactElement;
}) {
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
