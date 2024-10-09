import { Layout } from './Layout.tsx'
import { Box, Flex, VStack, Text } from '@chakra-ui/react'
import { FormProvider, useForm, useFieldArray } from 'react-hook-form'
import { TravelersModalProps, FormData } from '@widgets/TravelersModal/ui/types.ts'
import { useTranslation } from 'react-i18next'
import { capitalize } from '@shared/utils'
import MDatePicker from '@/components/FormControls/MDatePicker/MDatePicker.tsx'
import { Button, Input } from '@/shared/ui/index.ts'
import { PackagesFields } from '@/modules/packages/data/packagesEnums.ts'
import { useEffect } from 'react'

export const TravelersModal = ({
	                               closeModal,
	                               onSuccess,
	                               packageDetails,
	                               travelers,
	                               isOpen = false
                               }: TravelersModalProps) => {
	const { t } = useTranslation()
	console.log('TravelersModal@packageDetails : ', packageDetails)

	const methods = useForm<FormData>({
		defaultValues: {
			adults: Array(packageDetails.adultTravelers).fill({ firstMame: '', lastName: '', dateOfBirth: '' }),
			children: Array(packageDetails.childrenTravelers + packageDetails.infantTravelers).fill({
				firstMame: '',
				lastName: '',
				dateOfBirth: ''
			})
		}
	})

	const { handleSubmit, register, formState: { errors }, control, setValue } = methods

	const { fields: adultsFields } = useFieldArray({
		control,
		name: 'adults'
	})

	const { fields: childrenFields } = useFieldArray({
		control,
		name: 'children'
	})

	const handleFormSubmit = (data: any) => {
		onSuccess(data)
		// closeModal()
	}

	useEffect(() => {
		if (travelers.adults.length > 0 || travelers.children.length > 0) {
			setValue('adults', travelers.adults)
			setValue('children', travelers.children)
		}
	}, [travelers, setValue])

	return (
		<FormProvider {...methods}>
			<Layout title={capitalize(t`travelers`)} isOpen={isOpen} closeModal={closeModal}>
				<Flex
					direction="column"
					justify="space-between"
					as="form"
					onSubmit={handleSubmit(handleFormSubmit)}
					width="full"
					height="full"
				>
					<VStack spacing="6" width="full" py="6" px="4" overflowY="scroll"
					        maxHeight={{ base: 'calc(100dvh - 160px)', md: 'calc(600px - 160px)' }}>
						{adultsFields.map((field, index) => (
							<VStack key={field.id} spacing="4" width="full" align="stretch">
								<Text size="sm" fontWeight="bold">{capitalize(t`adult`)} {index + 1}</Text>

								<Input
									type="text"
									placeholder={t`writeNameLatinWords`}
									label={t`name`}
									size="lg"
									{...register(`adults.${index}.firstName`, { required: t`requiredField` })}
									helperText={errors.adults?.[index]?.firstName?.message}
									state={errors.adults?.[index]?.firstName ? 'invalid' : 'default'}
									onChange={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
								/>

								<Input
									type="text"
									placeholder={t`writeSurnameLatinWords`}
									label={t`surname`}
									size="lg"
									{...register(`adults.${index}.lastName`, { required: t`requiredField` })}
									helperText={errors.adults?.[index]?.lastName?.message}
									state={errors.adults?.[index]?.lastName ? 'invalid' : 'default'}
									onChange={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
								/>

								<MDatePicker
									name={`adults.${index}.dateOfBirth`}
									placeholderText={t`dateOfBirth`}
									label={t`dateOfBirth`}
									maxDate={
										new Date(
											new Date().setFullYear(
												new Date().getFullYear() - (packageDetails?.childMaxAge || 1) + 1
											)
										)
									}
								/>
							</VStack>
						))}

						{childrenFields.map((field, index) => (
							<VStack key={field.id} spacing="4" width="full" align="stretch">
								<Text size="sm" fontWeight="bold">{t`child`} {index + 1}</Text>

								<Input
									type="text"
									placeholder={t`writeNameLatinWords`}
									label={t`name`}
									size="lg"
									{...register(`children.${index}.firstName`, { required: t`requiredField` })}
									helperText={errors.children?.[index]?.firstName?.message}
									state={errors.children?.[index]?.firstName ? 'invalid' : 'default'}
									onChange={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
								/>

								<Input
									type="text"
									placeholder={t`writeSurnameLatinWords`}
									label={t`surname`}
									size="lg"
									{...register(`children.${index}.lastName`, { required: t`requiredField` })}
									helperText={errors.children?.[index]?.lastName?.message}
									state={errors.children?.[index]?.lastName ? 'invalid' : 'default'}
									onChange={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
								/>

								<MDatePicker
									name={`children.${index}.dateOfBirth`}
									placeholderText={t`dateOfBirth`}
									label={t`dateOfBirth`}
									minDate={
										new Date(
											new Date().setFullYear(new Date().getFullYear() - (packageDetails?.[PackagesFields.childMaxAge] || 1))
										)
									}
								/>
							</VStack>
						))}
					</VStack>

					<Box p="4" width="full" borderTop="1px solid" borderColor="gray.100" backgroundColor="white" mt="auto">
						<Button variant="solid-blue" type="submit" size="lg" width="full">
							{t`continue`}
						</Button>
					</Box>
				</Flex>
			</Layout>
		</FormProvider>
	)
}
