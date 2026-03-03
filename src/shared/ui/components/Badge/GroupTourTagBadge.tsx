import { Text } from '@shared/ui'
import { Flex, FlexProps } from '@chakra-ui/react'

export const GroupTourTagBadge = ({ children, ...props }: FlexProps) => {
	return (
		<Layout status="success" {...props}>
			{children}
		</Layout>
	)
}

const Layout = ({ children, status, ...props }: FlexProps & {status: 'success'}) => {
	return (
		<Flex
			bgColor={COLORS_MAP[status].bg}
			px="3"
			height="32px"
			rounded="full"
			align="center"
			justify="center"
			{...props}
		>
			<Text
				size="xs"
				color={COLORS_MAP[status].text}
				fontWeight="medium"
			>
				{children}
			</Text>
		</Flex>
	)
}

const COLORS_MAP = {
	success: {
		text: 'green.500',
		bg: 'green.50'
	}
}