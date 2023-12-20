import { useEffect, useState } from "react";
import PrivateEntriesAuthenticate from "./PrivateEntriesAuthenticate";
import PrivateEntriesView from "./PrivateEntriesView";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";

export default function PrivateEntries() {
  const passwordKey = sessionStorage.getItem(Constants.PASSWORD_KEY);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { api } = useApi();

  const res = api.get("/journal/", {}, { headers: { "Password-Key": passwordKey } });
  res.then((result) => {
    setIsAuthenticated(result.status === 200);
  });
  return isAuthenticated ? (
    <PrivateEntriesView />
  ) : (
    <PrivateEntriesAuthenticate />
  );
}
