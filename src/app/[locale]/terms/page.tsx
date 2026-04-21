import { TermsPage } from "@pages/TermsPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Terms");

export default function Terms() {
  return <TermsPage />;
}
