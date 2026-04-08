import { Flex, ListItem } from '@chakra-ui/react'
import { Icon, Text, Tooltip } from '@ui'
import type { DetailsListItemProps } from './types'


export const DetailsListItem = ({
  isWithoutBorder,
  label,
  value,
  tooltipText,
}: DetailsListItemProps) => (
  <ListItem
    display="flex"
    justifyContent="space-between"
    borderBottom={isWithoutBorder ? 'none' : '1px solid'}
    borderColor="gray.100"
    pb={isWithoutBorder ? '0' : '2'}
  >
    <Text size="xs" color="gray.500">
      {label}
    </Text>

    <Flex align="center">
      <Text size="xs" color="gray.800" ml="2" align="end">
        {value}
      </Text>

      {tooltipText ? (
        <Tooltip label={tooltipText} hasArrow shouldWrapChildren>
          <Flex
            justify="center"
            align="center"
            ml="1"
            p={1}
            borderRadius="full"
            cursor="pointer"
          >
            <Icon name="info-outline" size="16" color="gray.800" />
          </Flex>
        </Tooltip>
      ) : null}
    </Flex>
  </ListItem>
)

