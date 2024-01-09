import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { Constants } from "../../constants";
import { useApi } from "../../contexts/ApiProvider";
import PrivateEntriesAuthenticate from "./PrivateEntriesAuthenticate";
import PrivateEntriesView from "./PrivateEntriesView";

/**
 * The private entries page
 * append `?date=YYYY-MM-DD` to the URL to jump to a certain date 
 */
export default function PrivateEntries() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { api } = useApi();
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    const passwordKey = sessionStorage.getItem(Constants.PASSWORD_KEY);
    const res = api.get("/journal/", {}, { headers: { "Password-Key": passwordKey } });
    res.then((result) => {
      setIsAuthenticated(result.status === 200);
      setIsLoading(false);
    }).catch(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, [retry]);

  return isAuthenticated ? (
    <PrivateEntriesView />
  ) : (
    <>
      {isLoading && <div className="m-20"><Spinner /></div>}
      {!isLoading && <PrivateEntriesAuthenticate hasError={hasError} setHasError={setHasError} setRetry={setRetry} />}
    </>
  );
}
