import { Text } from '@shared/ui'
import { Flex, FlexProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

export const FlightDateBadge = ({ children, date, ...props }: FlexProps & {date: Date | string}) => {
	const { t } = useTranslation()

	return (
		<Layout status="success" {...props}>
			{t`flightDate`} {moment(date).format('DD.MM.YYYY')}
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