import { type FormEvent, type ReactNode } from 'react'

export type ProfileDetailsModalProps = {
  closeModal: () => void
  onSuccess: () => void
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
}

export type ContentLayoutProps = {
  children: ReactNode | ReactNode[]
  onSubmit?: (e: FormEvent<HTMLDivElement>) => void
  isLoading?: boolean
  isSubmitDisabled?: boolean
}

export type ProfileDetailsFormProps = {
  formData?: ProfileFormData
  onSubmit: (data: ProfileFormData) => void
  isLoading?: boolean
}

export type ProfileFormData = {
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
}
