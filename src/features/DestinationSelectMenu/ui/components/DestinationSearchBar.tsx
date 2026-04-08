import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Icon, Input } from '@ui'

export const DestinationSearchBar = ({
  searchValue,
  onSearchValueChange,
  placeholder
}: {
  searchValue: string
  onSearchValueChange: (v: string) => void
  placeholder: string
}) => {
  return (
    <Flex
      align="center"
      border="1px solid"
      borderColor="gray.400"
      borderRadius="12px"
      px="3"
      mb="2"
    >
      <Icon
        name="search"
        width="20px !important"
        height="20px !important"
        color="gray.500"
      />
      <Input
        value={searchValue}
        type="text"
        onChange={e => onSearchValueChange(e.target.value)}
        placeholder={placeholder}
        borderRadius="10px"
        border="none"
        boxShadow="none"
        _focus={{ border: 'none', boxShadow: 'none' }}
      />
    </Flex>
  )
}

