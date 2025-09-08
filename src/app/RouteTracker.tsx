import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaEvents } from "@/shared/configs/metaEvents";

export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Fire PageView event on every route change
    metaEvents.pageView(location.pathname);
  }, [location]);

  return null;
}
