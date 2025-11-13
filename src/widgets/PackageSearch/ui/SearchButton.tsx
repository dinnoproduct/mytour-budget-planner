import React from 'react'
import { Button } from '@ui'
import { useTranslation } from 'react-i18next'

interface SearchButtonProps {
  onClick: () => void
  isDisabled?: boolean
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  isDisabled = false
}) => {
  const { t } = useTranslation()

  return (
    <Button
      borderRadius="12px"
      size="lg"
      width={{ base: 'full', md: 'auto' }}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {t`search`}
    </Button>
  )
}

