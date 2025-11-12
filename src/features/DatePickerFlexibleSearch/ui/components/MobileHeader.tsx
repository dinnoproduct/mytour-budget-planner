import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Text, Button } from '@ui'
import { useTranslation } from 'react-i18next'

interface MobileHeaderProps {
  onClose: () => void
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onClose }) => {
  const { t } = useTranslation()

  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      justify="space-between"
      px="4"
      height="64px"
      align="center"
      width="full"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Text size="md" fontWeight="semibold">
        {t`duration`}
      </Text>

      <Button
        icon="close"
        aria-label="Close calendar"
        variant="solid-gray"
        size="lg"
        onClick={onClose}
      />
    </Flex>
  )
}

