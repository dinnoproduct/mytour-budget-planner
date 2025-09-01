import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Button } from "@/shared/ui";

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: "left" | "right";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  placement = "right",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {

  return (
    <Drawer
      isOpen={isOpen}
      placement={placement}
      onClose={onClose}
      size={{ base: "full", sm: "md", md: "lg", lg: "xl" }}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
    >
      <DrawerOverlay />
      <DrawerContent bg="gray.50">
        {title && (
          <DrawerHeader
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
            px={6}
            py={4}
          >
            <Flex height="12" alignItems="center">
              <Button
                display={{ base: "flex", sm: "none" }}
                variant="text-blue"
                iconBefore="arrow-back"
                onClick={onClose}
              >
                {title}
              </Button>
              <Text
                display={{ base: "none", sm: "block" }}
                fontSize="md"
                fontWeight={{ base: "normal", sm: "bold" }}
                color={{ base: "blue.500", sm: "gray.800" }}
              >
                {title}
              </Text>
              <DrawerCloseButton
                display={{ base: "none", sm: "block" }}
                px={3}
                height={12}
              />
            </Flex>
          </DrawerHeader>
        )}

        <DrawerBody p={0}>
          <Box>{children}</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
