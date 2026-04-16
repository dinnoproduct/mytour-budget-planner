import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { PackageDetailsPage } from "@pages/PackageDetailsPage";

export default function Package() {
  return (
    <PackagesPageLayout>
      <PackageDetailsPage />
    </PackagesPageLayout>
  );
}
