import { PackagesPageLayout } from "@/components/PackagesPageLayout/PackagesPageLayout";
import { buildPageMetadata } from "@/app/metadata";
import { WriteHotelReviewPage } from "@pages/WriteHotelReviewPage";

export const metadata = buildPageMetadata("Write Review");

export default function ReviewPage() {
  return (<></>
    // <PackagesPageLayout>
    //   <WriteHotelReviewPage />
    // </PackagesPageLayout>
  );
}
