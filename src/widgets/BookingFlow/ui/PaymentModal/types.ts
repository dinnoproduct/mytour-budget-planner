import { type ReactNode } from 'react'
import {
  type PrepaymentInfo,
  type PackageEntity,
  type PaymentSystem,
} from '@entities/package'
import { type RadioProps } from '@ui'
import { type BoxProps, type ListProps } from '@chakra-ui/react'
import { type Travelers } from '@widgets/TravelersModal/ui/types'
import { type UseMutationResult } from '@tanstack/react-query'
import { type PromoCodeValidationResponse, type PromoCodeValidationParams } from '@entities/package'
import { BookingStep } from '@/shared/configs/metaEvents'

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
  validatePromoCode?: UseMutationResult<
    PromoCodeValidationResponse,
    unknown,
    Omit<PromoCodeValidationParams, 'userId'>
  >
  handleLogEvent: (step: { name: BookingStep; number: number }) => void
  skipPreviewStep?: boolean
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
  packageDetails: PackageEntity
}

export type PreviewDetailsViewProps = {
  onPay: () => void
  onUsePromocode: () => void
  isLoadingBooking?: boolean
  packageDetails: PackageEntity
  travelers: Travelers
  paymentAmount: number
  isFullPricePayment: boolean
  prepaymentInfo?: PrepaymentInfo | null
  validatePromoCode: any
  promoCodeStatus: {
    isApplied: boolean;
    code: string;
    discount: number;
    finalAmount: number;
  }
  setPromoCodeStatus: (status: {
    isApplied: boolean;
    code: string;
    discount: number;
    finalAmount: number;
  }) => void
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

export type ListItem = { 
  key: ReactNode; 
  value: ReactNode;
  isStrikethrough?: boolean;
  isDiscount?: boolean;
  isHighlighted?: boolean;
}
