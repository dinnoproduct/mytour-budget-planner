import { Flex } from '@chakra-ui/react'
import { Illustration, Text } from '@ui'
import { EmptyStateProps } from './types'

export const EmptyState = ({ illustrationName, children, ...props }: EmptyStateProps) => {
	return (
		<Flex
			direction="column"
			maxWidth="552px"
			width="full"
			align="center"
			mx="auto"
			px="7"
			{...props}
		>
			<Illustration name={illustrationName} />

			<Text size="sm" color="gray.600" align="center" mt="4">
				{children}
			</Text>
		</Flex>
	)
}

