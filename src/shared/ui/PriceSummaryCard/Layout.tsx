import { Box, Grid, type BoxProps } from "@chakra-ui/react";
import { type ReactNode } from "react";

enum LayoutAreas {
  AVAILABILITY = "availability",
  CONFIG = "config",
  LATE_CHECKOUT = "lateCheckout",
  TOTAL_PRICE = "totalPrice",
  SUBSCRIBE_CTA = "subscribeCTA",
}

export type PriceSummaryLayoutProps = {
  children: ReactNode;
  isFixed?: boolean;
} & BoxProps;

export const PriceSummaryCardLayout = ({
  children,
  isFixed,
  ...props
}: PriceSummaryLayoutProps) => (
  <Box width={{ base: "full", md: "442px" }} {...props}>
    <Grid
      width={{ base: "full", md: "442px" }}
      height="auto"
      borderY="1px solid"
      borderX={{
        base: "none",
        md: "none",
      }}
      borderColor="transparent"
      rounded={{ base: "none", md: "2xl" }}
      templateAreas={{
        base: `
        "${LayoutAreas.AVAILABILITY}"
        "${LayoutAreas.CONFIG}"
        "${LayoutAreas.LATE_CHECKOUT}"
        "${LayoutAreas.TOTAL_PRICE}"
        "${LayoutAreas.SUBSCRIBE_CTA}"
        `,
        md: `
        "${LayoutAreas.CONFIG}"
        "${LayoutAreas.AVAILABILITY}"
        "${LayoutAreas.LATE_CHECKOUT}"
        "${LayoutAreas.TOTAL_PRICE}"
        "${LayoutAreas.SUBSCRIBE_CTA}"
        `,
      }}
      gridTemplateRows="auto"
      gridTemplateColumns="1fr"
      position={isFixed ? "fixed" : "static"}
      top={isFixed ? "90px" : "auto"}
    >
      {children}
    </Grid>
  </Box>
);
