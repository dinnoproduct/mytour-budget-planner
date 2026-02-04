import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Icon, Text } from '@ui'

const TabItem = ({
  iconName,
  label
}: {
  iconName: string
  label: string
}) => {
  const { t } = useTranslation()

  return (
    <Flex align="center">
      <Icon name={iconName} size="16" />

      <Text ml="0.5" className="tab-label" whiteSpace="nowrap">
        {t(label)}
      </Text>

    </Flex>
  )
}

export const HotelTabItem = () => (
  <TabItem
    iconName="hotels"
    label="hotel"
  />
)
export const PackageTabItem = () => (
  <TabItem iconName="packages" label="package" />
)

export const GroupTabItem = () => (
  <TabItem iconName="group-tours" label="groupTours" />
)
