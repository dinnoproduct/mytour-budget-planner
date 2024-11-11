import { Layout } from './Layout.tsx'
import { Box, Flex, VStack, Text } from '@chakra-ui/react'
import { FormProvider, useForm, useFieldArray } from 'react-hook-form'
import { useState, useEffect, useCallback } from 'react'
import {
  type TravelersModalProps,
  type FormData,
  type Traveler
} from '@widgets/TravelersModal/ui/types.ts'
import { useTranslation } from 'react-i18next'
import { capitalize, debounce } from '@shared/utils'
import MDatePicker from '@/components/FormControls/MDatePicker/MDatePicker.tsx'
import { Button, Input } from '@/shared/ui/index.ts'
import { PackagesFields } from '@/modules/packages/data/packagesEnums.ts'
import moment from 'moment'

export const TravelersModal = ({
  closeModal,
  onSuccess,
  packageDetails,
  travelers,
  isOpen = false,
  onChange
}: TravelersModalProps) => {
  const { t } = useTranslation()
  const [normalizedTravelers, setNormalizedTravelers] = useState<Traveler[]>([])

  useEffect(() => {
    setNormalizedTravelers([
      ...(travelers.adults || []),
      ...(travelers.children || [])
    ])
  }, [travelers])

  const methods = useForm<FormData>({
    defaultValues: {
      adults: Array(packageDetails.adultTravelers).fill({
        firstName: '',
        lastName: '',
        dateOfBirth: ''
      }),
      children: Array(
        packageDetails.childrenTravelers + packageDetails.infantTravelers
      ).fill({
        firstName: '',
        lastName: '',
        dateOfBirth: ''
      })
    }
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    watch
  } = methods

  const { fields: adultsFields } = useFieldArray({
    control,
    name: 'adults'
  })

  const { fields: childrenFields } = useFieldArray({
    control,
    name: 'children'
  })

  const handleFormSubmit = (data: FormData) => {
    onSuccess(data)
  }

  useEffect(() => {
    if (travelers.adults.length > 0 || travelers.children.length > 0) {
      setValue('adults', travelers.adults)
      setValue('children', travelers.children)
    }
  }, [travelers, setValue])

  const updateNormalizedTravelers = useCallback(
    debounce((data: Traveler[]) => {
      console.log('onChange : ', data)
      onChange && onChange(data)
    }, 2000),
    []
  )

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('watch : ', {
        value,
        name,
        type
      })

      if (!name) {
        return
      }

      const [group, index, _field] = name.split('.')
      const groupValue = value[group as keyof typeof value] as Traveler[]
      const traveler = groupValue[parseInt(index)]
      const updatedTraveler = { ...traveler }
      console.log('updatedTraveler : ', updatedTraveler)

      if (
        updatedTraveler.firstName?.length >= 2 &&
        updatedTraveler.lastName?.length >= 2 &&
        updatedTraveler.dateOfBirth
      ) {
        const updatedTravelers: Traveler[] = [...normalizedTravelers]

        while (updatedTravelers.length <= parseInt(index)) {
          updatedTravelers.push({
            firstName: '',
            lastName: '',
            dateOfBirth: ''
          })
        }

        updatedTravelers[parseInt(index)] = updatedTraveler
        setNormalizedTravelers(updatedTravelers)
        const filledTravelers = updatedTravelers.filter(
          (traveler: any) => traveler.dateOfBirth
        )
        updateNormalizedTravelers(filledTravelers)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, normalizedTravelers, updateNormalizedTravelers])

  return (
    <FormProvider {...methods}>
      <Layout
        title={capitalize(t`travelers`)}
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <Flex
          direction="column"
          justify="space-between"
          as="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          width="full"
          height="full"
        >
          <VStack
            spacing="6"
            width="full"
            py="6"
            px="4"
            overflowY="scroll"
            maxHeight={{
              base: 'calc(100dvh - 160px)',
              md: 'calc(600px - 160px)'
            }}
            sx={{
              '&::-webkit-scrollbar': {
                width: '0'
              }
            }}
          >
            {adultsFields.map((field, index) => (
              <VStack key={field.id} spacing="4" width="full" align="stretch">
                <Text size="sm" fontWeight="bold">
                  {capitalize(t`adult`)} {index + 1}
                </Text>

                <Input
                  type="text"
                  placeholder={t`writeNameLatinWords`}
                  label={t`name`}
                  size="lg"
                  {...register(`adults.${index}.firstName`, {
                    required: t`requiredField`,
                    pattern: {
                      value: /^[A-Za-z]{2,}$/,
                      message: t`invalidFormatErrorMessage`
                    }
                  })}
                  helperText={errors.adults?.[index]?.firstName?.message}
                  state={
                    errors.adults?.[index]?.firstName ? 'invalid' : 'default'
                  }
                  onChange={e => {
                    const value = e.target.value.replace(/[^a-zA-Z]/g, '')
                    e.target.value = value
                    setValue(`adults.${index}.firstName`, value)
                  }}
                />

                <Input
                  type="text"
                  placeholder={t`writeSurnameLatinWords`}
                  label={t`surname`}
                  size="lg"
                  {...register(`adults.${index}.lastName`, {
                    required: t`requiredField`,
                    pattern: {
                      value: /^[A-Za-z]{2,}$/,
                      message: t`invalidFormatErrorMessage`
                    }
                  })}
                  helperText={errors.adults?.[index]?.lastName?.message}
                  state={
                    errors.adults?.[index]?.lastName ? 'invalid' : 'default'
                  }
                  onChange={e => {
                    const value = e.target.value.replace(/[^a-zA-Z]/g, '')
                    e.target.value = value
                    setValue(`adults.${index}.lastName`, value)
                  }}
                />

                <MDatePicker
                  name={`adults.${index}.dateOfBirth`}
                  placeholderText={t`dateOfBirth`}
                  label={t`dateOfBirth`}
                  maxDate={moment()
                    .subtract((packageDetails?.childMaxAge || 1) + 1, 'years')
                    .toDate()}
                />
              </VStack>
            ))}

            {childrenFields.map((field, index) => (
              <VStack key={field.id} spacing="4" width="full" align="stretch">
                <Text size="sm" fontWeight="bold">
                  {t`child`} {index + 1}
                </Text>

                <Input
                  type="text"
                  placeholder={t`writeNameLatinWords`}
                  label={t`name`}
                  size="lg"
                  {...register(`children.${index}.firstName`, {
                    required: t`requiredField`,
                    pattern: {
                      value: /^[A-Za-z]{2,}$/,
                      message: t`invalidFormatErrorMessage`
                    }
                  })}
                  helperText={errors.children?.[index]?.firstName?.message}
                  state={
                    errors.children?.[index]?.firstName ? 'invalid' : 'default'
                  }
                  onChange={e => {
                    const value = e.target.value.replace(/[^a-zA-Z]/g, '')
                    e.target.value = value
                    setValue(`children.${index}.firstName`, value)
                  }}
                />

                <Input
                  type="text"
                  placeholder={t`writeSurnameLatinWords`}
                  label={t`surname`}
                  size="lg"
                  {...register(`children.${index}.lastName`, {
                    required: t`requiredField`,
                    pattern: {
                      value: /^[A-Za-z]{2,}$/,
                      message: t`invalidFormatErrorMessage`
                    }
                  })}
                  helperText={errors.children?.[index]?.lastName?.message}
                  state={
                    errors.children?.[index]?.lastName ? 'invalid' : 'default'
                  }
                  onChange={e => {
                    const value = e.target.value.replace(/[^a-zA-Z]/g, '')
                    e.target.value = value
                    setValue(`children.${index}.lastName`, value)
                  }}
                />

                <MDatePicker
                  name={`children.${index}.dateOfBirth`}
                  placeholderText={t`dateOfBirth`}
                  label={t`dateOfBirth`}
                  minDate={moment()
                    .subtract(
                      packageDetails?.[PackagesFields.childMaxAge] || 1,
                      'years'
                    )
                    .subtract(1, 'years')
                    .add(1, 'day')
                    .toDate()}
                  maxDate={moment().subtract(1, 'days').toDate()}
                />
              </VStack>
            ))}
          </VStack>

          <Box
            p="4"
            width="full"
            borderTop="1px solid"
            borderColor="gray.100"
            backgroundColor="white"
            mt="auto"
          >
            <Button variant="solid-blue" type="submit" size="lg" width="full">
              {t`continue`}
            </Button>
          </Box>
        </Flex>
      </Layout>
    </FormProvider>
  )
}
