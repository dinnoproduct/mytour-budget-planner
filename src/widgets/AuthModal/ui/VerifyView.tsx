import { Flex, VStack } from '@chakra-ui/react'
import { Button, Input, Text, Illustration, AlertCardMessage } from '@ui'
import { useEffect, useState } from 'react'
import { VerifyViewProps } from '@widgets/AuthModal/ui/types'
import { useConfirmLogin, useConfirmRegistration, useResendOTP, useUserContext } from '@entities/user'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@widgets/AuthModal/ui/ContentLayout'

const OTP_LENGTH = 4

export const VerifyView = ({ onSuccess, type, payload, onViewChange, layoutVariant = 'modal' }: VerifyViewProps) => {
	const { t } = useTranslation()
	const [verificationCode, setVerificationCode] = useState('')
	const { setUserToken } = useUserContext()
	const [showError, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const { mutateAsync: confirmRegistrationAsync, isPending: isLoadingConfirmRegistration } = useConfirmRegistration()
	const { mutateAsync: confirmLoginAsync, isPending: isLoadingConfirmLogin } = useConfirmLogin()
	const { mutate: resendVerificationCode } = useResendOTP()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShowError(false)
		const sanitizedValue = event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
		setVerificationCode(sanitizedValue)
	}

	const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault()
		let pastedData = event.clipboardData.getData('text')
		pastedData = pastedData.replace(/\D/g, '')
		setVerificationCode(pastedData.slice(0, OTP_LENGTH))
	}

	const handleVerify = async (e: React.FormEvent<HTMLDivElement>) => {
		e.preventDefault()
		const code = verificationCode
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

	const contentContainerProps =
		layoutVariant === 'page'
			? {
				width: 'full',
				maxWidth: '500px',
				px: 0,
				height: 'auto',
				overflowY: 'visible' as const,
				spacing: 4
			}
			: { spacing: 4 }

	return (
		<ContentLayout
			primaryButtonLabel={t`confirm`}
			isDisabled={verificationCode.length !== OTP_LENGTH}
			contentContainerProps={contentContainerProps}
			onSubmit={(e) => handleVerify(e)}
			isLoading={isLoadingConfirmRegistration || isLoadingConfirmLogin}
			layoutVariant={layoutVariant}
		>
			<Flex direction="column" align="center" width="full" textAlign="center">
				<Illustration name="otp" />
			</Flex>

			<VStack spacing="4" width="full">
				<Text align="center" size="sm">
					{t('otpEnterText', { phoneNumber: payload.formData.phoneNumber })}
				</Text>

				<Input
					type="text"
					size="lg"
					value={verificationCode}
					maxLength={OTP_LENGTH}
					onChange={handleInputChange}
					onPaste={handlePaste}
					inputMode="numeric"
					textAlign="center"
					letterSpacing="0.4em"
					autoFocus
				/>

				<AlertCardMessage
					status="error"
					message={errorMessage}
					show={showError}
				/>

				<ResendCodeButton onResend={handleResendCode} />
			</VStack>
		</ContentLayout>
	)
}

const RESEND_TIMEOUT_SECONDS = 60

const ResendCodeButton = ({ onResend }: { onResend: () => void }) => {
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