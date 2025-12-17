import { Flex, FlexProps } from '@chakra-ui/react'
import { Icon, Text } from '@ui'

export const HotelStarBadge = ({ starsCount, isPositionAbsolute, ...props }: {
	starsCount: number
	isPositionAbsolute?: boolean
} & FlexProps) => {
	return (
		<Flex
			{...(isPositionAbsolute && {
				position: "absolute",
				bottom: "2",
				right: "2"
			})}
			bgColor="orange.500"
			color="white"
			px="2"
			height="20px"
			rounded="full"
			fontSize="sm"
			align="center"
			{...props}
		>
			<Icon name="star" color="white" size="12"/>

			<Text size="xs" color="white" ml=".5">
				{starsCount}
			</Text>
		</Flex>
	)
}