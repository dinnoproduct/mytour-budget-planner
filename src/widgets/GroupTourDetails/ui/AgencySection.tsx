import { Flex } from '@chakra-ui/react'
import { Avatar, Text } from '@ui'
import type { GroupTourAgency } from '@entities/package'

type AgencySectionProps = {
  agency: GroupTourAgency
}

export const AgencySection = ({ agency }: AgencySectionProps) => (
  <Flex
    align="center"
    pb={3}
    gap={2}
    borderBottom="1px solid"
    borderColor="gray.100"
    mb={4}
  >
    <Avatar name={agency?.name} size="sm" flexShrink={0} />
    <Text
      fontSize="sm"
      color="gray.900"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {agency.name}
    </Text>
  </Flex>
)
