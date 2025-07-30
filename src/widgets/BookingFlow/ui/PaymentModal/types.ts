import { type ReactNode } from 'react'
import {
  type PrepaymentInfo,
  type PackageEntity,
  type PaymentSystem
} from '@entities/package'
import { type RadioProps } from '@ui'
import { type BoxProps, type ListProps } from '@chakra-ui/react'
import { type Travelers } from '@widgets/TravelersModal/ui/types'

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
  isLateCheckout?: boolean
  travelers?: Travelers
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
  onSubmit: (method: PaymentMethod) => void
  isLoadingBooking?: boolean
}

export type PreviewDetailsViewProps = {
  onPay: () => void
  onUsePromocode: () => void
  isLoadingBooking?: boolean
  packageDetails: PackageEntity
  isLateCheckout?: boolean
  travelers: Travelers
  paymentAmount: number
  isFullPricePayment: boolean
  prepaymentInfo?: PrepaymentInfo | null
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
  | 'previewDetails'

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
  },
  previewDetails: {
    title: 'dataCheck'
  }
}

export type SectionLayoutProps = {
  children?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  listItems?: ListItem[]
} & BoxProps

export type SectionListProps = {
  listItems: ListItem[]
} & ListProps

type ListItem = { key: ReactNode; value: ReactNode }
