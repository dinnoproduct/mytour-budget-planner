import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaEvents } from "@/shared/configs/metaEvents";
import { storeUTMParams, restoreStoredUTMsToUrl } from "@/utils/utmParams";

export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Capture UTMs from URL on first touch (persist for session)
    storeUTMParams();
    // After redirect from payment gateway (or any external redirect), restore stored UTMs to URL
    restoreStoredUTMsToUrl();
  }, [location.pathname, location.search]);

  useEffect(() => {
    // Fire PageView event on every route change
    metaEvents.pageView(location.pathname);
  }, [location]);

  return null;
}
