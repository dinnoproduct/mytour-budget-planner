import { Input } from '@ui'
import { useForm } from 'react-hook-form'
import { SignInViewProps } from '@widgets/AuthModal/ui/types.ts'
import { useLogin } from '@entities/user/hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from './ContentLayout'

export const SignInView = ({ onSuccess, formData }: SignInViewProps) => {
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
			onSuccess?.({ formData: {
					phoneNumber: getValues('phoneNumber')
				}
			})
		} catch(error) {
		}
	}

	return (
		<ContentLayout
			primaryButtonLabel={t`sign-in`}
			onSubmit={handleSubmit(handleSignIn)}
			isLoading={isPending}
		>
			<Input
				type="tel"
				label={t`phoneNumber`}
				placeholder="+374 00 00 00 00"
				size="lg"
				{...register('phoneNumber', {
					required: t`requiredField`,
					pattern: {
						value: /^\+[0-9]{11,}$/,
						message: t`invalidFormatErrorMessage`
					},
					onChange: (e) => {
						e.target.value = e.target.value.replace(/\s+/g, '')
					}
				})}
				helperText={errors.phoneNumber?.message}
				state={errors.phoneNumber?.message ? 'invalid' : 'default'}
			/>
		</ContentLayout>
	)
}