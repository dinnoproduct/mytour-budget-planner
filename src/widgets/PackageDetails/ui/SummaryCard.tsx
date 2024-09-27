import { Box, Flex, HStack } from '@chakra-ui/react'
import { Icon, Text } from '@ui'
import { IconName } from '@foundation/Iconography'

export const SummaryCard = ({iconName, children}: {iconName: IconName, children: string}) => {
	return (
		<HStack spacing="2" align="center">
			<Flex
				bgColor="gray.100"
				rounded="base"
				width="28px"
				height="28px"
				align="center"
				justify="center"
			>
				<Icon name={iconName} size="20" color="gray.500"/>
			</Flex>

			<Text size="sm">{children}</Text>
		</HStack>
	)
}
