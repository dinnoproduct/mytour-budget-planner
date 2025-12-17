import { Flex } from '@chakra-ui/react'
import { Button, Illustration, Text } from '@ui'
import { type EmptyStateProps } from './types'

export const EmptyState = ({
  illustrationName,
  text,
  buttonLabel,
  onClick,
  buttonProps = {},
  ...props
}: EmptyStateProps) => (
  <Flex
    direction="column"
    maxWidth="552px"
    width="full"
    align="center"
    mx="auto"
    px="7"
    {...props}
  >
    <Illustration name={illustrationName} />

    <Text size="sm" color="gray.600" align="center" mt="4">
      {text}
    </Text>

    {buttonLabel && (
      <Button
        mt="4"
        size="lg"
        variant="solid-blue"
        {...buttonProps}
        width="fit-content"
      >
        {buttonLabel}
      </Button>
    )}
  </Flex>
)
