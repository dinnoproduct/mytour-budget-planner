import { Input } from '@ui'
import { useForm } from 'react-hook-form'
import { SignUpViewProps } from '@widgets/AuthModal/ui/types.ts'
import { useRegister } from '@entities/user/hooks/useRegister'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@widgets/AuthModal/ui/ContentLayout.tsx'

export const SignUpView = ({ onSuccess, onViewChange, formData }: SignUpViewProps) => {
	const { t } = useTranslation()
	const { handleSubmit, register, formState: { errors }, getValues } = useForm({
		defaultValues: {
			firstname: formData?.firstname || '',
			lastname: formData?.lastname || '',
			email: formData?.email || '',
			phoneNumber: formData?.phoneNumber || '+374'
		}
	})

	const { mutate: registerUser, isPending } = useRegister({
		onSuccess: (user) => {
			onSuccess && onSuccess?.({
				user, formData: {
					firstname: getValues('firstname'),
					lastname: getValues('lastname'),
					email: getValues('email'),
					phoneNumber: getValues('phoneNumber')
				}
			})
		},
		onError: (error: any) => {
			const code = error?.response?.data?.Code
			// console.log('registerUser@error', error)
			if (code === 7) {
				onViewChange?.('signIn', {
					formData: {
						phoneNumber: getValues('phoneNumber')
					},
					isAlreadyRegistered: true,
				})
			}
		}
	})

	const handleSignUp = (data: any) => {
		// console.log('handleSignUp@data', data)
		registerUser(data)
	}

	return (
		<ContentLayout
			primaryButtonLabel={t`sign-up`}
			secondaryButtonLabel={t`sign-in`}
			onSubmit={handleSubmit(handleSignUp)}
			contentContainerProps={{
				height: { base: 'calc(100dvh - 216px)', md: 'calc(540px - 216px)' }
			}}
			onSecondaryButtonClick={() => onViewChange?.('signIn')}
			isLoading={isPending}
		>
			<Input
				type="text"
				placeholder={t`writeNameLatinWords`}
				label={t`name`}
				size="lg"
				{...register('firstname', {
					required: t`requiredField`,
					pattern: {
						value: /^[A-Za-z]{2,}$/,
						message: t`invalidFormatErrorMessage`
					},
					onChange: (e) => {
						e.target.value = e.target.value.replace(/\s+/g, '')
					}
				})}
				helperText={errors.firstname?.message}
				state={errors.firstname?.message ? 'invalid' : 'default'}
				onChange={(e) => {
					const value = e.target.value.replace(/[^a-zA-Z]/g, '')
					e.target.value = value;
				}}
			/>

			<Input
				type="text"
				placeholder={t`writeSurnameLatinWords`}
				label={t`surname`}
				size="lg"
				{...register('lastname', {
					required: t`requiredField`,
					pattern: {
						value: /^[A-Za-z]{2,}$/,
						message: t`invalidFormatErrorMessage`
					},
					onChange: (e) => {
						e.target.value = e.target.value.replace(/\s+/g, '')
					}
				})}
				helperText={errors.lastname?.message}
				state={errors.lastname?.message ? 'invalid' : 'default'}
				onChange={(e) => {
					const value = e.target.value.replace(/[^a-zA-Z]/g, '')
					e.target.value = value;
				}}
			/>

			<Input
				type="email"
				label={t`email`}
				placeholder={t`enterEmailAddress`}
				size="lg"
				{...register('email', {
					required: t`requiredField`,
					pattern: {
						value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						message: t`invalidFormatErrorMessage`
					},
					onChange: (e) => {
						e.target.value = e.target.value.replace(/\s+/g, '')
					}
				})}
				helperText={errors.email?.message}
				state={errors.email?.message ? 'invalid' : 'default'}
			/>

			<Input
				type="tel"
				label={t`phoneNumber`}
				placeholder="+374 00 00 00 00"
				size="lg"
				{...register('phoneNumber', {
					required: t`requiredField`,
					pattern: {
						value: /^\+[0-9]{10,15}$/,
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