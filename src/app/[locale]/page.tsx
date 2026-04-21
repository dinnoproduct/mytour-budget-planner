import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { HomePage } from "@pages/HomePage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Home");

export default function Home() {
  return (
    <PackagesPageLayout>
      <HomePage />
    </PackagesPageLayout>
  );
}
