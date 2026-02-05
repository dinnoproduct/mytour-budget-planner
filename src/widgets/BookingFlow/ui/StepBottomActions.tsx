import { Box, Flex } from '@chakra-ui/react'
import { Button } from '@ui'

type StepBottomActionsProps = {
  onBack?: () => void
  backLabel?: string
  primaryButton: React.ReactNode
  /** When true, renders only the button row without outer container (for nesting) */
  inline?: boolean
}

export const StepBottomActions = ({
  onBack,
  backLabel = 'back',
  primaryButton,
  inline = false,
}: StepBottomActionsProps) => {
  const content = (
    <Flex gap={2} width="full" mt={inline ? 3 : 0}>
      {onBack ? (
        <>
          <Button
            variant="outline"
            size="lg"
            flex="1"
            onClick={onBack}
          >
            {backLabel}
          </Button>
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
    >
      {content}
    </Box>
  )
}
