import { BookingResultPage } from "@pages/BookingResultPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Booking Result");

export default function BookingResult() {
  return <BookingResultPage />;
}
