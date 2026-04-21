import { AuthGuard } from "@/components/AuthGuard/AuthGuard";
import { PaymentPage } from "@pages/PaymentPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Payment");

export default function Payment() {
  return (
    <AuthGuard>
      <PaymentPage />
    </AuthGuard>
  );
}
