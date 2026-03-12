import React from "react"
import { Box, Text } from "@chakra-ui/react"

interface SectionProps {
  title: string
  isFirst?: boolean
  hideTitle?: boolean
  children: React.ReactNode
}

export const Section = ({
  title,
  isFirst = false,
  hideTitle = false,
  children,
}: SectionProps) => (
  <Box
    bg={isFirst ? "gray.50" : "transparent"}
    py={isFirst ? { base: 6, md: 8 } : 0}
  >
    <Box maxW="910px" mx="auto" mt={8} px={4}>
      {!hideTitle && (
        <Text
          as="h2"
          fontSize={isFirst ? "30px" : "20px"}
          fontWeight={700}
          lineHeight={isFirst ? "133%" : "120%"}
          color="gray.800"
          mb="24px"
        >
          {title}
        </Text>
      )}
      <Box mt={0}>{children}</Box>
    </Box>
  </Box>
)
