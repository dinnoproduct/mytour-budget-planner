import { BlogsPage } from "@pages/BlogsPage";
import { buildPageMetadata } from "@/app/metadata";

export const metadata = buildPageMetadata("Blogs");

export default function Blogs() {
  return <BlogsPage />;
}
