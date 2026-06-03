import { Box, Flex } from '@chakra-ui/react'
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

const CYPRUS_TAB_ICON_URL = '/assets/icons/cyprus-tab.png'

export const CyprusTabItem = () => {
  const { t } = useTranslation()

  return (
    <Flex align="center">
      <Box
        className="cyprus-tab-icon"
        aria-hidden
        flexShrink={0}
        w="16px"
        h="16px"
        bg="currentColor"
        sx={{
          maskImage: `url(${CYPRUS_TAB_ICON_URL})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${CYPRUS_TAB_ICON_URL})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      />
      <Text ml="0.5" className="tab-label" whiteSpace="nowrap">
        {t('cyprus')}
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
