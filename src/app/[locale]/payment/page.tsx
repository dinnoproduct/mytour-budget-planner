import { AuthGuard } from "@/components/AuthGuard/AuthGuard";
import { PaymentPage } from "@pages/PaymentPage";

export default function Payment() {
  return (
    <AuthGuard>
      <PaymentPage />
    </AuthGuard>
  );
}
