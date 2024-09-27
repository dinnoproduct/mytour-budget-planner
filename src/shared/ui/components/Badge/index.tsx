import { Flex, FlexProps, Grid } from '@chakra-ui/react'
import { Icon, Text } from '@ui'

export const PaginationBadge = ({ currentIndex, imagesCount, isPositionAbsolute, ...props }: {
	currentIndex: number
	imagesCount: number
	isPositionAbsolute?: boolean
} & FlexProps) => {
	return (
		<Flex
			{...(isPositionAbsolute && {
				position: "absolute",
				bottom: "2",
				left: "2"
			})}
			bgColor="blackAlpha.500"
			color="white"
			px="2"
			height="20px"
			rounded="full"
			fontSize="sm"
			align="center"
			{...props}
		>
			<Text size="xs" color="white">
				{currentIndex + 1}/{imagesCount}
			</Text>
		</Flex>
	)
}

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

export const StatusBadge = ({ isPositionAbsolute, ...props }: {
	isPositionAbsolute?: boolean
} & FlexProps) => {
	return (
		<Flex
			{...(isPositionAbsolute && {
				position: "absolute",
				top: "0",
				left: "0"
			})}
			bgColor="green.600"
			color="white"
			px="3"
			height="24px"
			rounded="8px 24px 24px 0px"
			fontSize="sm"
			align="center"
			{...props}
		>
			<Text size="xs" color="white" ml=".5">
				All inclusive
			</Text>
		</Flex>
	)
}