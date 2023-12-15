import PrivateEntriesAuthenticate from "./PrivateEntriesAuthenticate";
import PrivateEntriesView from "./PrivateEntriesView";

export default function PrivateEntries() {
  const isAuthenticated = true;
  return isAuthenticated ? (
    <PrivateEntriesView />
  ) : (
    <PrivateEntriesAuthenticate />
  );
}
