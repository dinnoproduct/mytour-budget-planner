import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { PackageDetailsPage } from "@pages/PackageDetailsPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Package Details");

export default function Package() {
  return (
    <PackagesPageLayout>
      <PackageDetailsPage />
    </PackagesPageLayout>
  );
}
