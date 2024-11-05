import { type ReactNode } from 'react'
import { type PackageEntity } from '@entities/package'

export type PaymentModalProps = {
  closeModal: () => void
  onSuccess: (paymentAmount: number) => void
  onBackClick: () => void
  packageDetails: PackageEntity
  isOpen?: boolean
  view?: PaymentModalView
}

export type PaymentFormViewProps = {
  onSuccess: (paymentAmount: number) => void
  packageDetails: PackageEntity
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
  title: string
  onBackClick?: () => void
}

export type PaymentModalView = 'paymentForm' | 'paymentError'
