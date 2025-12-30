import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID: string | undefined = import.meta.env
  .VITE_GA_MEASUREMENT_ID as unknown as string | undefined;

let initialized = false;

function hasMeasurementId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0;
}

export function initGA4(): void {
  if (initialized) return;
  if (!hasMeasurementId(GA_MEASUREMENT_ID)) return;

  ReactGA.initialize(GA_MEASUREMENT_ID);
  initialized = true;
}

/**
 * Track ONLY page views (no custom events). Call this on route changes.
 */
export async function trackPageView(pagePath: string): Promise<void> {
  initGA4();
  if (!initialized) return;

  // react-ga4 sends GA4 page_view hits via gtag under the hood.
  ReactGA.send({
    hitType: "pageview",
    page: pagePath,
    title: document.title,
  });
}


