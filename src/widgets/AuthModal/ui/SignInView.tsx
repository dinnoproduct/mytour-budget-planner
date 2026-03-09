import { Input, Text } from '@ui'
import { useForm } from 'react-hook-form'
import { SignInViewProps } from '@widgets/AuthModal/ui/types.ts'
import { useLogin } from '@entities/user/hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from './ContentLayout'

export const SignInView = ({ onSuccess, formData, isAlreadyRegistered, onViewChange, layoutVariant = 'modal' }: SignInViewProps) => {
	const { t } = useTranslation()
	const { handleSubmit, register, formState: { errors }, getValues } = useForm({
		defaultValues: {
			phoneNumber: formData?.phoneNumber || '+374'
		}
	})

	const { mutateAsync: loginUserAsync, isPending } = useLogin()

	const handleSignIn = async (data: any) => {
		try {
			await loginUserAsync(data.phoneNumber.trim())
			onSuccess?.({
				formData: {
					phoneNumber: getValues('phoneNumber')
				}
			})
		} catch (error: any) {
			onViewChange?.('signInError')
		}
	}

	const contentContainerProps =
		layoutVariant === 'page'
			? {
					width: 'full',
					maxWidth: '500px',
					px: 0,
					height: 'auto',
					overflowY: 'visible' as const
				}
			: undefined

	return (
		<ContentLayout
			primaryButtonLabel={t`sign-in`}
			onSubmit={handleSubmit(handleSignIn)}
			isLoading={isPending}
			contentContainerProps={contentContainerProps}
			layoutVariant={layoutVariant}
		>
			{isAlreadyRegistered ? (
				<Text size="sm" fontWeight="bold" mb="6" align="center">
					{t`alreadyRegisteredText`}
				</Text>
			) : null}

			<Input
				type="tel"
				label={t`phoneNumber`}
				placeholder="+374 00 00 00 00"
				isReadOnly={isAlreadyRegistered}
				cursor={isAlreadyRegistered ? 'not-allowed' : 'auto'}
				size="lg"
				{...register('phoneNumber', {
					required: t`requiredField`,
					pattern: {
						value: /^\+[0-9]{11,}$/,
						message: t`invalidFormatErrorMessage`
					},
					onChange: (e) => {
						let sanitizedValue = e.target.value.replace(/\s+/g, '')
						if (sanitizedValue.length > 16) {
							sanitizedValue = sanitizedValue.slice(0, 16)
						}
						e.target.value = sanitizedValue
					}
				})}
				helperText={errors.phoneNumber?.message}
				state={errors.phoneNumber?.message ? 'invalid' : 'default'}
			/>
		</ContentLayout>
	)
}