import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Icon, NewBadge, Text } from '@ui'
import { type ReactNode } from 'react'

const TabItem = ({
  iconName,
  label,
  badge
}: {
  iconName: string
  label: string
  badge?: ReactNode
}) => {
  const { t } = useTranslation()

  return (
    <Flex align="center">
      <Icon name={iconName} size="16" />

      <Text ml="0.5" className="tab-label">
        {t(label)}
      </Text>

      {badge}
    </Flex>
  )
}

export const HotelTabItem = () => (
  <TabItem
    iconName="hotels"
    label="hotel"
    badge={<NewBadge ml="2" mb="-1" />}
  />
)
export const PackageTabItem = () => (
  <TabItem iconName="packages" label="package" />
)
