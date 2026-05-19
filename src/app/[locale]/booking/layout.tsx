import type { ReactNode } from "react";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Booking");

export default function BookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

