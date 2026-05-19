"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { metaEvents } from "@/shared/configs/metaEvents";
import { storeUTMParams, restoreStoredUTMsToUrl } from "@/utils/utmParams";

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    storeUTMParams();
    restoreStoredUTMsToUrl();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    metaEvents.pageView(pathname);
  }, [pathname]);

  return null;
}
