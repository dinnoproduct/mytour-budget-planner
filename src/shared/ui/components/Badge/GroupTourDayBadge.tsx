import { Text } from '@shared/ui'
import { Flex, FlexProps } from '@chakra-ui/react'

export const GroupTourDayBadge = ({ children, ...props }: FlexProps) => {
	return (
		<Layout status="success" {...props}>
			{children}
		</Layout>
	)
}

const Layout = ({ children, status, ...props }: FlexProps & {status: 'success'}) => {
	return (
		<Flex
			bgColor="gray.100"
			px="3"
			height="28px"
			rounded="full"
			align="center"
			justify="center"
			flexWrap={"nowrap"}
			{...props}
		>
			<Text
				width="auto"
				whiteSpace="nowrap"
				size="xs"
				color="gray.800"
				fontWeight="semibold"
			>
				{children}
			</Text>
		</Flex>
	)
}
