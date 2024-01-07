import { useState } from "react";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import PrivateEntriesAuthenticate from "./PrivateEntriesAuthenticate";
import PrivateEntriesView from "./PrivateEntriesView";

/**
 * The private entries page
 * append `?date=YYYY-MM-DD` to the URL to jump to a certain date 
 */
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
