import { Navigate, useLocation } from "react-router-dom";
import { useRepo } from "../contexts/RepoProvider";
import { UserRepository } from "../data/repositories/UserRepository";
import React from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { userRepo }: { userRepo: UserRepository } = useRepo();
  const userResult = userRepo.getSelf();
  const location = useLocation();

  if (userResult.isLoading) {
    return null;
  } else if (userResult.isSuccess) {
    return children;
  } else {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/" state={{ next: url }} />;
  }
}
