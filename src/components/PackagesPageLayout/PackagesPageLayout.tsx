"use client";

import { type ReactNode } from "react";
import {
  PackagesSearchProvider,
  HotelPackagesSearchProvider,
} from "@entities/package";

interface Props {
  children: ReactNode;
}

export function PackagesPageLayout({ children }: Props) {
  return (
    <PackagesSearchProvider>
      <HotelPackagesSearchProvider>{children}</HotelPackagesSearchProvider>
    </PackagesSearchProvider>
  );
}
