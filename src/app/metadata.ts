import type { Metadata } from "next";

const APP_NAME = "My Tour";

export const buildPageMetadata = (pageTitle: string): Metadata => ({
  title: `${APP_NAME} ${pageTitle}`,
});

