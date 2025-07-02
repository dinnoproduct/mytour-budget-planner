import { type ReactNode } from 'react'
import { PrepaymentInfo, type PackageEntity, type PaymentSystem } from '@entities/package'
import { type RadioProps } from '@ui'

export type PaymentModalProps = {
  closeModal: () => void
  onSuccess: (
    paymentAmount: number,
    paymentSystem: PaymentSystem
  ) => Promise<string | undefined>
  onBackClick?: () => void
  packageDetails: PackageEntity
  isOpen?: boolean
  view?: PaymentModalView
  isLoadingBooking?: boolean
  isBooked?: boolean
  prepaymentInfo?: PrepaymentInfo | null
}

export type PaymentFormViewProps = {
  onSubmit: (paymentAmount: number, selectedOption: PaymentOption) => void
  packageDetails: PackageEntity
  isLoadingBooking?: boolean
  isBooked?: boolean
  initialPaymentOption?: PaymentOption
  prepaymentInfo?: PrepaymentInfo | null
}

export type PaymentMethodViewProps = {
  onSubmit: (method: PaymentMethod) => Promise<void>
  isLoadingBooking?: boolean
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
  title: string
  onBackClick?: () => void
}

export type PaymentModalView =
  | 'paymentForm'
  | 'paymentError'
  | 'paymentMethod'
  | 'ameriaPay'

export enum PaymentMethod {
  bankCard = 'bankCard',
  ameriaPay = 'ameriaPay'
}

export type PaymentOption = 'noPrepayment' | 'pay'

export type PaymentMethodCardProps = {
  label: string
  imgSrc: string
  imgAlt?: string
  radioProps?: RadioProps
  isBorder?: boolean
  isDisabled?: boolean
  labelSuffix?: ReactNode
}

export const VIEW_CONTENT_MAP: {
  [key in PaymentModalView]: { title: string }
} = {
  paymentForm: {
    title: 'payment'
  },
  paymentMethod: {
    title: 'paymentMethod'
  },
  paymentError: {
    title: ''
  },
  ameriaPay: {
    title: 'MyAmeria'
  }
}
