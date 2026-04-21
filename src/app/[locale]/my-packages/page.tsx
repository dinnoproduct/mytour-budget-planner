import { AuthGuard } from "@/components/AuthGuard/AuthGuard";
import { MyPackagesPage } from "@pages/MyPackagesPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("My Packages");

export default function MyPackages() {
  return (
    <AuthGuard>
      <MyPackagesPage />
    </AuthGuard>
  );
}
