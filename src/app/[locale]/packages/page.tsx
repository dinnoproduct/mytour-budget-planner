import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { PackageListPage } from "@pages/PackageListPage";

export default function Packages() {
  return (
    <PackagesPageLayout>
      <PackageListPage />
    </PackagesPageLayout>
  );
}
