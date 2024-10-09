import { Flex } from '@chakra-ui/react'
import { Icon, Text } from '@ui'
import React from 'react'
import { CardAlertMessageProps, CardAlertMessageStatus } from '@components/Alert/types.ts'
import { IconName } from '@foundation/Iconography'

export const AlertCardMessage = ({ message, show = true, status, ...props }: CardAlertMessageProps) => {
	return (
		<Flex
			display={show ? 'flex' : 'none'}
			width="full"
			py="2"
			px="2"
			bgColor={STATUS_MAP[status].bgColor}
			rounded="md"
			align="center"
			{...props}
		>
			<Icon
				name={STATUS_MAP[status].icon}
				color={STATUS_MAP[status].color}
				size="24"
			/>

			<Text
				color={STATUS_MAP[status].color}
				size="xs"
				ml="2"
			>
				{message}
			</Text>
		</Flex>
	)
}

const STATUS_MAP: {
	[key in CardAlertMessageStatus]: {
		color: string
		bgColor: string,
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
	}
}