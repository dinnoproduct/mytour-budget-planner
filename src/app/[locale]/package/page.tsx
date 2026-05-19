import type { Metadata } from "next";
import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { PackageDetailsPage } from "@pages/PackageDetailsPage";
import { buildPageMetadata } from "@/app/metadata";
import { PackageService } from "@entities/package/api/PackageService";
import type { PackageEntity } from "@entities/package";

const packageService = new PackageService();

const NAME_KEY: Record<string, keyof PackageEntity> = {
  hy: "nameArm",
  en: "nameEng",
  ru: "nameRus",
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const offerId = sp.offerId ? parseInt(sp.offerId as string, 10) : null;
  const agencyId = sp.agencyId ? parseInt(sp.agencyId as string, 10) : null;

  if (!offerId || !agencyId) return buildPageMetadata("Package Details");

  try {
    const pkg = await packageService.getPackage(offerId, agencyId);
    const nameKey = (NAME_KEY[locale] ?? "nameArm") as keyof PackageEntity;
    const name = (pkg[nameKey] as string) || pkg.nameArm;
    const title = `${name} | My Tour`;
    const image = pkg.hotel.images?.[0]?.url;

    return {
      title,
      openGraph: {
        title,
        ...(image && { images: [{ url: image }] }),
      },
    };
  } catch {
    return buildPageMetadata("Package Details");
  }
}

export default function Package() {
  return (
    <PackagesPageLayout>
      <PackageDetailsPage />
    </PackagesPageLayout>
  );
}
