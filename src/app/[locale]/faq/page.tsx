import { FAQPage } from "@pages/FAQPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("FAQ");

export default function FAQ() {
  return <FAQPage />;
}
