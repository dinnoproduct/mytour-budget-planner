import { Button } from "@ui";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { ContentLayoutProps } from "@widgets/AuthModal/ui/types.ts";

export const ContentLayout = ({
  contentContainerProps,
  onSubmit,
  primaryButtonLabel,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  children,
  isLoading,
}: ContentLayoutProps) => {
  const isPage = contentContainerProps?.overflowY === "visible" || contentContainerProps?.width === "full";

  return (
    <Flex
      direction="column"
      justify="space-between"
      as="form"
      onSubmit={onSubmit}
      width="full"
      {...(isPage ? {} : { height: 'full' })}
    >
      <VStack
        spacing="6"
        py="6"
        px="4"
        mx="auto"
        overflowY={isPage ? 'visible' : 'scroll'}
        width="full"
        maxWidth="402px"
        {...(isPage ? {} : { height: { base: 'calc(100dvh - 160px)', md: 'calc(480px - 160px)' } })}
        {...contentContainerProps}
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
        {children}
      </VStack>

      <Box
        p="4"
        width="full"
        borderTop="1px solid"
        borderColor="gray.100"
        backgroundColor="white"
        mt={isPage ? 5 : "auto"}
        gap={isPage ? 2 : 0}
        display={isPage ? { base: "flex" } : "block"}
        flexDirection={isPage ? { base: "column", md: "row-reverse" } : "column"}
        px={isPage ? { base: 4, md: 0 } : undefined}
        position={isPage ? { base: "fixed", md: "relative" } : "relative"}
        bottom={isPage ? { base: 0, md: undefined } : undefined}
        left={isPage ? { base: 0, md: undefined } : undefined}
        right={isPage ? { base: 0, md: undefined } : undefined}
        zIndex={isPage ? { base: 10, md: 0 } : 0}
      >
        <Button
          variant="solid-blue"
          type="submit"
          size="lg"
          width="full"
          isLoading={isLoading}
        >
          {primaryButtonLabel}
        </Button>

        {secondaryButtonLabel ? (
          <Button
            onClick={onSecondaryButtonClick}
            variant="solid-gray"
            size="lg"
            width="full"
            mt={isPage ? 0 : 2}
          >
            {secondaryButtonLabel}
          </Button>
        ) : null}
      </Box>
    </Flex>
  );
};
