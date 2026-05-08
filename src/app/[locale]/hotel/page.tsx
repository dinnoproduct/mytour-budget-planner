import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { HotelPackageDetailsPage } from "@pages/HotelPackageDetailsPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Hotels");

export default function Hotel() {
  return (
    <PackagesPageLayout>
      <HotelPackageDetailsPage />
    </PackagesPageLayout>
  );
}
