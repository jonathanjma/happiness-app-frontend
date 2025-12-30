import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../ga4";

export default function PageViewTracker() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`;

    // React 18 StrictMode runs effects twice in dev; this also prevents
    // duplicate events from any re-mounts where the path hasn't changed.
    if (lastPathRef.current === pagePath) return;
    lastPathRef.current = pagePath;

    void trackPageView(pagePath);
  }, [location.pathname, location.search]);

  return null;
}


