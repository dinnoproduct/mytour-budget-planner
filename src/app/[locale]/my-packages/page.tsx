import { AuthGuard } from "@/components/AuthGuard/AuthGuard";
import { MyPackagesPage } from "@pages/MyPackagesPage";

export default function MyPackages() {
  return (
    <AuthGuard>
      <MyPackagesPage />
    </AuthGuard>
  );
}
