import { Box, Flex } from '@chakra-ui/react'
import { Button } from '@ui'

type StepBottomActionsProps = {
  onBack?: () => void
  backLabel?: string
  primaryButton: React.ReactNode
  /** When true, renders only the button row without outer container (for nesting) */
  inline?: boolean
  /** When true, sticks to bottom on mobile (for page layout) */
  stickyOnMobile?: boolean
  isDisabled?: boolean
  isLoadingBooking?: boolean
}

export const StepBottomActions = ({
  onBack,
  backLabel = 'Back',
  primaryButton,
  inline = false,
  stickyOnMobile = false,
  isDisabled = false,
  isLoadingBooking = false,
}: StepBottomActionsProps) => {
  const content = (
    <Flex gap={2} width="full" mt={inline ? 3 : 0} flexDirection={{ base: 'column-reverse', md: 'row' }}>
      {onBack ? (
        <>
          <Flex flex="1" minW={0}>
            <Button
              variant="solid-gray"
              size="lg"
              width="full"
              onClick={onBack}
              isDisabled={isDisabled}
              isLoading={isLoadingBooking}
            >
              {backLabel}
            </Button>
          </Flex>
          <Flex flex="1" minW={0}>
            {primaryButton}
          </Flex>
        </>
      ) : (
        <Box flex="1" width="full">
          {primaryButton}
        </Box>
      )}
    </Flex>
  )

  if (inline) {
    return content
  }

  return (
    <Box
      p="4"
      width="full"
      borderTop="1px solid"
      borderColor="gray.100"
      backgroundColor="white"
      mt="auto"
      position={stickyOnMobile ? { base: 'fixed', md: 'relative' } : 'relative'}
      bottom={stickyOnMobile ? { base: 0, md: undefined } : undefined}
      left={stickyOnMobile ? { base: 0, md: undefined } : undefined}
      right={stickyOnMobile ? { base: 0, md: undefined } : undefined}
      zIndex={stickyOnMobile ? { base: 10, md: 0 } : 0}
    >
      {content}
    </Box>
  )
}
