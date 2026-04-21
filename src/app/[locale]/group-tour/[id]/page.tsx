import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { GroupTourDetailsPage } from "@pages/GroupTourDetailsPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Group Tour");

export default function GroupTour() {
  return (
    <PackagesPageLayout>
      <GroupTourDetailsPage />
    </PackagesPageLayout>
  );
}
