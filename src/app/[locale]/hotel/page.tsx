import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { HotelPackageDetailsPage } from "@pages/HotelPackageDetailsPage";

export default function Hotel() {
  return (
    <PackagesPageLayout>
      <HotelPackageDetailsPage />
    </PackagesPageLayout>
  );
}
