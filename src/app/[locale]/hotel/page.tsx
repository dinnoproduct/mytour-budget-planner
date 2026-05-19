import type { Metadata } from "next";
import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { HotelPackageDetailsPage } from "@pages/HotelPackageDetailsPage";
import { buildPageMetadata } from "@/app/metadata";
import { PackageService } from "@entities/package/api/PackageService";

const packageService = new PackageService();

export async function generateMetadata({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const offerId = sp.offerId ? parseInt(sp.offerId as string, 10) : null;
  const agencyId = sp.agencyId ? parseInt(sp.agencyId as string, 10) : null;

  if (!offerId || !agencyId) return buildPageMetadata("Hotels");

  try {
    const pkg = await packageService.getHotelPackage(offerId, agencyId);
    const title = `${pkg.hotel.name} | My Tour`;
    const image = pkg.hotel.images?.[0]?.url;

    return {
      title,
      openGraph: {
        title,
        ...(image && { images: [{ url: image }] }),
      },
    };
  } catch {
    return buildPageMetadata("Hotels");
  }
}

export default function Hotel() {
  return (
    <PackagesPageLayout>
      <HotelPackageDetailsPage />
    </PackagesPageLayout>
  );
}
