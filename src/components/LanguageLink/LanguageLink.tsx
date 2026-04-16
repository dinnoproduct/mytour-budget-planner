"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useLanguageRouting } from "../../hooks/useLanguageRouting";
import { appendStoredUTMsToPath } from "@/utils/utmParams";

interface LanguageLinkProps extends Omit<ChakraLinkProps, "href"> {
  to: string;
}

export const LanguageLink = forwardRef<HTMLAnchorElement, LanguageLinkProps>(
  ({ to, ...props }, ref) => {
    const { getPathWithLanguage } = useLanguageRouting();
    const href = appendStoredUTMsToPath(getPathWithLanguage(to));

    return (
      <ChakraLink
        ref={ref}
        as={NextLink}
        href={href}
        {...props}
      />
    );
  }
);

LanguageLink.displayName = "LanguageLink";
