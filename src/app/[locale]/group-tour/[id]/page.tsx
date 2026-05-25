import type { Metadata } from "next";
import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { GroupTourDetailsPage } from "@pages/GroupTourDetailsPage";
import { buildPageMetadata } from "@/app/metadata";
import { GroupTourService } from "@entities/package/api/GroupTourService";

const groupTourService = new GroupTourService();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    const tour = await groupTourService.getGroupTourInfo(id);
    const name =
      locale === "en" ? tour.name.eng :
      locale === "ru" ? tour.name.rus :
      tour.name.arm;
    const title = `${name} | My Tour`;
    const mainImage =
      tour.gallery.find((g) => g.isMain)?.url ?? tour.gallery[0]?.url;

    return {
      title,
      openGraph: {
        title,
        ...(mainImage && { images: [{ url: mainImage }] }),
      },
    };
  } catch {
    return buildPageMetadata("Group Tour");
  }
}

export default function GroupTour() {
  return (
    <PackagesPageLayout>
      <GroupTourDetailsPage />
    </PackagesPageLayout>
  );
}
