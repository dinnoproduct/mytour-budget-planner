import { Flex } from '@chakra-ui/react'
import { Icon, Text } from '@ui'
import React from 'react'
import {
  CardAlertMultipleMessagesProps,
  type CardAlertMessageProps,
  type CardAlertMessageStatus
} from '@components/Alert/types.ts'
import { type IconName } from '@foundation/Iconography'

export const AlertCardMessage = ({
  message,
  show = true,
  status,
  iconPlacement = 'center',
  textSize = 'xs',
  showIcon = true,
  ...props
}: CardAlertMessageProps) => (
  <Flex
    display={show ? 'flex' : 'none'}
    width="full"
    py="2"
    px="2"
    bgColor={STATUS_MAP[status].bgColor}
    rounded="md"
    align={iconPlacement === 'center' ? 'center' : 'start'}
    {...props}
  >
    {showIcon && (
      <Icon
        name={STATUS_MAP[status].icon}
        color={STATUS_MAP[status].color}
        size="24"
        flexShrink={0}
      />
    )}

    <Text color={STATUS_MAP[status].color} size={textSize} ml="2">
      {message}
    </Text>
  </Flex>
)

export const AlertCardMultipleMessage = ({
  messages,
  show = true,
  status,
  iconPlacement = 'center',
  textSize = 'xs',
  showIcon = true,
  ...props
}: CardAlertMultipleMessagesProps) => (
  <Flex
    display={show ? 'flex' : 'none'}  
    width="full"
    py="2"
    px="2"
    bgColor={STATUS_MAP[status].bgColor}
    rounded="md"
    align={iconPlacement === 'center' ? 'center' : 'start'}
    {...props}
  >
    {showIcon && (
      <Icon
        name={STATUS_MAP[status].icon}
        color={STATUS_MAP[status].color}
        size="24"
        flexShrink={0}
      />
    )}
    <Flex direction="column">
      {messages.map((message, key) => (
        <Text key={key} color={STATUS_MAP[status].color} size={textSize} ml="2" mb={message.hasNewLine ? "2" : "0"}>
          {message.message}
        </Text>
      ))}
      </Flex>
  </Flex>
)


const STATUS_MAP: {
  [key in CardAlertMessageStatus]: {
    color: string
    bgColor: string
    icon: IconName
  }
} = {
  error: {
    color: 'red.500',
    bgColor: 'red.50',
    icon: 'status-error'
  },
  warning: {
    color: 'orange.500',
    bgColor: 'orange.50',
    icon: 'status-warning'
  },
  info: {
    color: 'blue.500',
    bgColor: 'blue.50',
    icon: 'status-info'
  }
}
