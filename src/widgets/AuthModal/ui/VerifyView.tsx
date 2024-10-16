import { Flex, HStack, VStack } from '@chakra-ui/react'
import { Button, Input, Text, Illustration, AlertCardMessage } from '@ui'
import { useEffect, useRef, useState } from 'react'
import { VerifyViewProps } from '@widgets/AuthModal/ui/types.ts'
import { useConfirmLogin, useConfirmRegistration, useResendOTP, useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@widgets/AuthModal/ui/ContentLayout.tsx'

const FIELD_COUNT = 4

export const VerifyView = ({ onSuccess, type, payload, onViewChange }: VerifyViewProps) => {
	const { t } = useTranslation()
	const [verificationCode, setVerificationCode] = useState(Array(FIELD_COUNT).fill(''))
	const { setUserToken } = useUserContext()
	const refs = Array(FIELD_COUNT).fill(0).map(() => useRef<HTMLInputElement>(null))
	const [showError, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const { mutateAsync: confirmRegistrationAsync, isPending: isLoadingConfirmRegistration } = useConfirmRegistration()
	const { mutateAsync: confirmLoginAsync, isPending: isLoadingConfirmLogin } = useConfirmLogin()
	const { mutate: resendVerificationCode } = useResendOTP()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setShowError(false)
		if (event.target.value.length > 1) {
			event.target.value = event.target.value[0]
		}
		const newVerificationCode = [...verificationCode]
		newVerificationCode[index] = event.target.value
		setVerificationCode(newVerificationCode)
		if (event.target.value && refs[index + 1]) {
			refs[index + 1].current?.focus()
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (event.key === 'Backspace' && !event.currentTarget.value && refs[index - 1]) {
			refs[index - 1].current?.focus()
		}
	}

	const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
		event.preventDefault()
		let pastedData = event.clipboardData.getData('text')
		pastedData = pastedData.replace(/\D/g, '')
		const pastedDigits = pastedData.split('')
		const newVerificationCode = [...verificationCode]
		let j = index
		for (let i = 0; i < pastedDigits.length && j < FIELD_COUNT; i++, j++) {
			newVerificationCode[j] = pastedDigits[i]
			if (refs[j + 1]) {
				refs[j + 1].current?.focus()
			}
		}
		setVerificationCode(newVerificationCode)
	}

	const handleVerify = async (e: React.FormEvent<HTMLDivElement>) => {
		e.preventDefault()
		const code = verificationCode.join('')
		let token

		try {
			if (type === 'signUp') {
				token = await confirmRegistrationAsync({ userId: payload.user.id, otp: code })
			} else {
				token = await confirmLoginAsync({ phoneNumber: payload.formData.phoneNumber, otp: code })
			}

			if (token) {
				onSuccess?.()
				setUserToken(token)
			}
		} catch (error: any) {
			const errorCode = error?.response?.data?.Code
			setShowError(true)
			setErrorMessage(t`incorrectOTPErrorMessage`)

			if (errorCode === 9) {
				onViewChange?.('otpError')
			}
		}
	}

	const handleResendCode = async () => {
		await resendVerificationCode(payload.formData.phoneNumber)
	}

	return (
		<ContentLayout
			primaryButtonLabel={t`confirm`}
			contentContainerProps={{ spacing: 4 }}
			onSubmit={(e) => handleVerify(e)}
			isLoading={isLoadingConfirmRegistration || isLoadingConfirmLogin}
		>
			<Flex direction="column" align="center" width="full" textAlign="center">
				<Illustration name="otp"/>
			</Flex>

			<VStack spacing="4" width="full">
				<Text align="center" size="sm">
					{t('otpEnterText', { phoneNumber: payload.formData.phoneNumber })}
				</Text>

				<HStack spacing="2">
					{refs.map((ref, index) => (
						<Input
							key={index}
							type="text"
							size="lg"
							maxLength={1}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange(event, index)}
							onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, index)}
							onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => handlePaste(event, index)}
							ref={ref}
						/>
					))}
				</HStack>

				<AlertCardMessage
					status="error"
					message={errorMessage}
					show={showError}
				/>

				<ResendCodeButton onResend={handleResendCode}/>
			</VStack>
		</ContentLayout>
	)
}

const RESEND_TIMEOUT_SECONDS = 60

const ResendCodeButton = ({ onResend }: {onResend: () => void}) => {
	const { t } = useTranslation()
	const [timeLeft, setTimeLeft] = useState(0)

	useEffect(() => {
		if (timeLeft > 0) {
			const timerId = setInterval(() => {
				setTimeLeft(prevTimeLeft => prevTimeLeft - 1)
			}, 1000)
			return () => clearInterval(timerId)
		}
	}, [timeLeft])

	const handleResendClick = () => {
		if (timeLeft === 0) {
			onResend()
			setTimeLeft(RESEND_TIMEOUT_SECONDS)
		}
	}

	// const formatTime = (seconds: number) => {
	// const minutes = Math.floor(seconds / 60)
	// const remainingSeconds = seconds % 60
	// return remainingSeconds
	// return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	// }

	return (
		<Button variant="text-blue" onClick={handleResendClick} size="sm" width="full" isDisabled={timeLeft > 0}>
			{timeLeft > 0 ? (
				<Text size="xs" color="gray.500">
					{t('resendIn', { seconds: timeLeft })}
				</Text>
			) : (
				<Text size="xs" color="blue.500">
					{t`resend`}
				</Text>
			)}
		</Button>
	)
}