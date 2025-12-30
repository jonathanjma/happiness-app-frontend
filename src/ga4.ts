declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID: string | undefined = import.meta.env
  .VITE_GA_MEASUREMENT_ID as unknown as string | undefined;

let gaInitPromise: Promise<void> | null = null;

function hasMeasurementId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0;
}

function ensureGtagGlobals() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };
}

function loadGtagScript(measurementId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ga4="gtag"]',
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    script.setAttribute("data-ga4", "gtag");
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Analytics gtag.js"));
    document.head.appendChild(script);
  });
}

/**
 * Initializes GA4 and disables the automatic `page_view` event.
 * This lets the app explicitly send ONLY page views on route changes.
 */
export async function initGA4(): Promise<void> {
  if (!hasMeasurementId(GA_MEASUREMENT_ID)) return;
  if (gaInitPromise) return gaInitPromise;

  gaInitPromise = (async () => {
    ensureGtagGlobals();
    await loadGtagScript(GA_MEASUREMENT_ID);
    ensureGtagGlobals();

    // Minimal init: configure, but prevent GA from auto-sending page views.
    window.gtag?.("js", new Date());
    window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false });
  })();

  return gaInitPromise;
}

export async function trackPageView(pagePath: string): Promise<void> {
  if (!hasMeasurementId(GA_MEASUREMENT_ID)) return;
  await initGA4();

  // GA4 recommended fields for SPA page views:
  // - page_location: full URL
  // - page_path: path + query
  // - page_title: document title
  window.gtag?.("event", "page_view", {
    page_location: window.location.href,
    page_path: pagePath,
    page_title: document.title,
  });
}


