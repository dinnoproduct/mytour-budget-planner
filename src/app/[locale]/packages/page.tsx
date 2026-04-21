import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { PackageListPage } from "@pages/PackageListPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Packages");

export default function Packages() {
  return (
    <PackagesPageLayout>
      <PackageListPage />
    </PackagesPageLayout>
  );
}
