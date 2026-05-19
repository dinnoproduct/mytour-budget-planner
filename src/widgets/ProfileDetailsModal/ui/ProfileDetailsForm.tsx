import { Input } from '@ui'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  type ProfileDetailsFormProps,
  type ProfileFormData
} from '@widgets/ProfileDetailsModal/ui/types'
import { ContentLayout } from './ContentLayout'
import { useEffect, useState } from 'react'

export const ProfileDetailsForm = ({
  formData,
  onSubmit,
  isLoading
}: ProfileDetailsFormProps) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstname: formData?.firstname || '',
      lastname: formData?.lastname || '',
      email: formData?.email || '',
      phoneNumber: formData?.phoneNumber || ''
    }
  })

  const [isFormChanged, setIsFormChanged] = useState(false)
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set())
  const watchedFields = useWatch({ control })

  useEffect(() => {
    const isChanged = JSON.stringify(watchedFields) !== JSON.stringify(formData)
    setIsFormChanged(isChanged)
  }, [watchedFields, formData])

  useEffect(() => {
    const fields = Object.keys(watchedFields) as Array<keyof ProfileFormData>
    const newChangedFields = new Set(changedFields)

    fields.forEach(field => {
      if (watchedFields[field] !== formData?.[field]) {
        newChangedFields.add(field)
      } else {
        newChangedFields.delete(field)
      }
    })

    setChangedFields(newChangedFields)
  }, [watchedFields, formData])

  const handleFormSubmit = (data: ProfileFormData) => {
    if (!isFormChanged) return
    onSubmit(data)
  }

  const isFieldChanged = (fieldName: string) => changedFields.has(fieldName)

  return (
    <ContentLayout
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoading={isLoading}
      isSubmitDisabled={!isFormChanged}
    >
      <Input
        type="text"
        placeholder={t`writeNameLatinWords`}
        label={t`name`}
        size="lg"
        color={
          isFieldChanged('firstname') ? INPUT_ACTIVE_COLOR : INPUT_DEFAULT_COLOR
        }
        _focus={{ color: INPUT_ACTIVE_COLOR }}
        {...register('firstname', {
          required: t`requiredField`,
          pattern: {
            value: /^[A-Za-z]{2,}$/,
            message: t`invalidFormatErrorMessage`
          },
          onChange: e => {
            const value = e.target.value.replace(/[^a-zA-Z]/g, '')
            setValue('firstname', value)
          }
        })}
        helperText={errors.firstname?.message}
        state={errors.firstname?.message ? 'invalid' : 'default'}
      />

      <Input
        type="text"
        placeholder={t`writeSurnameLatinWords`}
        label={t`surname`}
        size="lg"
        color={
          isFieldChanged('lastname') ? INPUT_ACTIVE_COLOR : INPUT_DEFAULT_COLOR
        }
        _focus={{ color: INPUT_ACTIVE_COLOR }}
        {...register('lastname', {
          required: t`requiredField`,
          pattern: {
            value: /^[A-Za-z]{2,}$/,
            message: t`invalidFormatErrorMessage`
          },
          onChange: e => {
            const value = e.target.value.replace(/[^a-zA-Z]/g, '')
            setValue('lastname', value)
          }
        })}
        helperText={errors.lastname?.message}
        state={errors.lastname?.message ? 'invalid' : 'default'}
      />

      <Input
        type="email"
        label={t`email`}
        placeholder={t`enterEmailAddress`}
        size="lg"
        color={
          isFieldChanged('email') ? INPUT_ACTIVE_COLOR : INPUT_DEFAULT_COLOR
        }
        _focus={{ color: INPUT_ACTIVE_COLOR }}
        {...register('email', {
          required: t`requiredField`,
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: t`invalidFormatErrorMessage`
          },
          onChange: e => {
            const value = e.target.value.replace(/\s+/g, '')
            setValue('email', value)
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
        {...register('phoneNumber')}
        state="disabled"
      />
    </ContentLayout>
  )
}

const INPUT_ACTIVE_COLOR = 'blackAlpha.900'
const INPUT_DEFAULT_COLOR = 'gray.500'
