"use client";

import { type ReactNode } from "react";
import {
  PackagesSearchProvider,
  HotelPackagesSearchProvider,
  CyprusPackagesSearchProvider,
} from "@entities/package";

interface Props {
  children: ReactNode;
}

export function PackagesPageLayout({ children }: Props) {
  return (
    <PackagesSearchProvider>
      <HotelPackagesSearchProvider>
        <CyprusPackagesSearchProvider>{children}</CyprusPackagesSearchProvider>
      </HotelPackagesSearchProvider>
    </PackagesSearchProvider>
  );
}
