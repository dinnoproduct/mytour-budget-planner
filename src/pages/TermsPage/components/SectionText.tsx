import { Text } from "@chakra-ui/react"

interface SectionTextProps {
  text: string
  hasSpacing?: boolean
}

export const SectionText = ({ text, hasSpacing = true }: SectionTextProps) => (
  <Text
    fontSize="14px"
    fontWeight={500}
    lineHeight="20px"
    color="gray.700"
    mb={hasSpacing ? 6 : 0}
  >
    {text}
  </Text>
)
