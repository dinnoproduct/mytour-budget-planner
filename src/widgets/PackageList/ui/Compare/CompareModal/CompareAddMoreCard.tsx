import { Flex } from '@chakra-ui/react'
import { Icon, Text } from '@ui'

type CompareAddMoreCardProps = {
  remainingSlots: number
  itemTypeLabel: string
  onClick: () => void
  t: (key: string, options?: Record<string, string | number>) => string
}

export const CompareAddMoreCard = ({
  remainingSlots,
  itemTypeLabel,
  onClick,
  t
}: CompareAddMoreCardProps) => (
  <Flex
    border="1px dashed"
    m={4}
    borderColor="blue.300"
    rounded="xl"
    bg="gray.50"
    boxSizing="border-box"
    align="center"
    justify="center"
    p="6"
    direction="column"
    textAlign="center"
    cursor="pointer"
    onClick={onClick}
  >
    <Flex
      width="48px"
      height="48px"
      rounded="full"
      bg="blue.500"
      color="white"
      align="center"
      justify="center"
      mb="4"
    >
      <Icon name="add" size="20" color="white" />
    </Flex>
    <Text size="lg" fontWeight="600" color="gray.800">
      {t('compare.addMore', {
        count: remainingSlots,
        itemType: itemTypeLabel.toLowerCase()
      })}
    </Text>
    <Text size="sm" color="gray.500" mt="2" fontWeight="400">
      {t('compare.goToSearchPage')}
    </Text>
  </Flex>
)
