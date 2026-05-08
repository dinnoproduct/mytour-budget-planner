import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { GroupTourGalleryPage } from "@pages/GroupTourGalleryPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Group Tour Gallery");

export default function GroupTourGallery() {
  return (
    <PackagesPageLayout>
      <GroupTourGalleryPage />
    </PackagesPageLayout>
  );
}
