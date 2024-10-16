import { Box, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Input } from '@/shared/ui/index.ts'
import { PaymentFormViewProps } from '@widgets/PaymentModal/ui/types.ts'
import { overDaysFromNow } from '@/utils/methods.ts'
import { useMemo, useState } from 'react'

export const PaymentFormView = ({
	                                onSuccess,
	                                packageDetails
}: PaymentFormViewProps) => {
	const { t } = useTranslation()
	const under21DaysFromNow = useMemo(() => {
		return !overDaysFromNow(
			packageDetails?.destinationFlight?.departureDate as string,
			21
		)
	}, [packageDetails?.destinationFlight?.departureDate])
	const [isPaymentInFull, setIsPaymentInFull] = useState(under21DaysFromNow)
	const minPrePaymentAmount = useMemo(() => {
		return under21DaysFromNow ? packageDetails.price : packageDetails.price * 0.5
	}, [under21DaysFromNow, packageDetails.price])
	const [paymentAmount, setPaymentAmount] = useState(minPrePaymentAmount)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isDisabled, setIsDisabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleAmountChange = (value: string | number) => {
		const number = Number(value)
		if (isNaN(number)) {
			return
		}

		if (number < minPrePaymentAmount) {
			setErrorMessage(`${t`minPrePayment`} ${minPrePaymentAmount}`)
			setPaymentAmount(number)
			setIsDisabled(true)
		} else if (number >= packageDetails.price) {
			setErrorMessage(null)
			setPaymentAmount(packageDetails.price)
			setIsDisabled(false)
		} else {
			setErrorMessage(null)
			setPaymentAmount(number)
			setIsDisabled(false)
		}
	}

	const handlePayInFullChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!under21DaysFromNow) {
			setIsPaymentInFull(e.target.checked)
			setErrorMessage(null)
			const amount = e.target.checked ? packageDetails.price : minPrePaymentAmount
			setPaymentAmount(amount)
			handleAmountChange(amount)
		}
	}

	const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
		if (errorMessage) {
			return
		}

		e.preventDefault()
		onSuccess(+paymentAmount)
		setIsLoading(true)
	}

	return (
		<Flex
			direction="column"
			justify="space-between"
			as="form"
			onSubmit={handleFormSubmit}
			width="full"
			height="full"
		>
			<Flex
				width="full" py="6" px="4" overflowY="scroll"
				maxHeight={{ base: 'calc(100dvh - 160px)', md: 'calc(464px - 160px)' }}
				direction="column"
				maxWidth="402px"
				mx="auto"
				sx={{
					'&::-webkit-scrollbar': {
						width: '0'
					}
				}}
			>
				<Text size="sm" fontWeight="semibold" align="center">
					{t('minPrePaymentText', {
						amount: minPrePaymentAmount
					})}
				</Text>

				<Input
					value={paymentAmount}
					onChange={(e) => handleAmountChange(e.target.value)}
					mt="6"
					isDisabled={isPaymentInFull || under21DaysFromNow}
					suffix
					helperText={errorMessage || ''}
					state={errorMessage ? 'invalid' : 'default'}
					rightIconName="dram"
				/>

				<Checkbox
					size="lg"
					mt="4"
					isDisabled={under21DaysFromNow}
					onChange={handlePayInFullChange}
					isChecked={isPaymentInFull}
				>
					{t`payInFull`}
				</Checkbox>

				<Text size="xs" color="gray.600" mt="6">
					{t`partialPaymentText`}
				</Text>
			</Flex>

			<Box
				p="4" width="full" borderTop="1px solid" borderColor="gray.100" backgroundColor="white" mt="auto"
			>
				<Button
					variant="solid-blue" type="submit" size="lg" width="full"
					isLoading={isLoading} isDisabled={isDisabled}
				>
					{t`pay`}
				</Button>
			</Box>
		</Flex>
	)
}