import { Layout } from './Layout.tsx'
import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { PaymentSuccessModalProps } from '@entities/package/ui/PaymentSuccessModal/ui/types.ts'
import { Illustration, Text } from '@ui'

export const PaymentSuccessModal = ({
	                                    closeModal
                                    }: PaymentSuccessModalProps) => {
	const { t } = useTranslation()

	return (
		<Layout isOpen={true} closeModal={closeModal}>
			<Flex
				width="full" py="10" px="4" overflowY="scroll"
				height={{ base: 'calc(100dvh - 160px)', md: 'calc(500px - 160px)' }}
				direction="column"
				maxWidth="402px"
				mx="auto"
				align="center"
			>
				<Illustration name="success"/>

				<Text size="sm" mt="4" align="center">
					{t`thankYouForBookingText`}
				</Text>
			</Flex>
		</Layout>
	)
}