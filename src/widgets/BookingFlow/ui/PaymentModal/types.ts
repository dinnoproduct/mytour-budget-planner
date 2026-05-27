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
    paymentSystem: PaymentSystem,
    paymentOption: PaymentOption,
    promoCodeInfo?: {
      promoCode: string
      initialPrice: number
      firstPaymentSum: number
    }
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
  renderAsPage?: boolean
  onViewChange?: (view: PaymentModalView) => void
  onPaymentOptionChange?: (paymentOption: PaymentOption) => void
  /** Parent’s selected option; used so stepper and form stay in sync when returning from travelers */
  paymentOption?: PaymentOption
  onNavigateToMyPackages?: (queryParams?: string) => void
  onSuccessClose?: () => void
  onPromoDiscountedPriceChange?: (price: number | null) => void
}

export type PaymentFormViewProps = {
  onSubmit: (paymentAmount: number, selectedOption: PaymentOption) => void
  packageDetails: PackageEntity
  isLoadingBooking?: boolean
  isBooked?: boolean
  initialPaymentOption?: PaymentOption
  prepaymentInfo?: PrepaymentInfo | null
  onBackClick?: () => void
  renderAsPage?: boolean
  /** When true, disables/hides the "no prepayment" option. Used when user must pay (e.g. paying remaining amount). */
  disableNoPrepayment?: boolean
}

export type PaymentMethodViewProps = {
  onSubmit: () => void
  isLoadingBooking?: boolean
  packageDetails: PackageEntity
  onBackClick?: () => void
  renderAsPage?: boolean
  /** Selected payment system code (e.g. 'VPos', 'MyAmeriaPay', 'IDram', or any backend value). */
  selectedMethod: PaymentMethod | string
  /** Called with the selected payment system code. */
  onMethodChange: (method: PaymentMethod | string) => void
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
    firstPayment: number;
    secondPayment: number;
    skipPayment: boolean;
  }
  setPromoCodeStatus: (status: {
    isApplied: boolean;
    code: string;
    discount: number;
    finalAmount: number;
    firstPayment: number;
    secondPayment: number;
    skipPayment: boolean;
  }) => void
  paymentOption?: PaymentOption
  onBackClick?: () => void
  renderAsPage?: boolean
  /** When provided (e.g. from booking flow), used for late checkout display; else falls back to packageDetails.lateCheckout then atom */
  isLateCheckout?: boolean
  onPromoDiscountedPriceChange?: (price: number | null) => void
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
  title: string
  onBackClick?: () => void
  renderAsPage?: boolean
  isLoadingBooking?: boolean
}

export type PaymentModalView =
  | 'paymentForm'
  | 'paymentError'
  | 'paymentMethod'
  | 'ameriaPay'
  | 'previewDetails'
  | 'paymentSuccess'

export enum PaymentMethod {
  bankCard = 'VPos',
  ameriaPay = 'MyAmeriaPay',
  idram = 'IDram',
  mir = 'Mir'
}

export type PaymentOption = 'payFull' | 'pay' | 'noPrepayment'

export type PaymentMethodCardProps = {
  label: string
  imgSrc: string
  imgAlt?: string
  radioProps?: RadioProps
  isBorder?: boolean
  isDisabled?: boolean
  labelSuffix?: ReactNode
  isActive?: boolean
  onChange?: (isChecked: boolean) => void
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
  },
  paymentSuccess: {
    title: 'payment'
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
  isNewLine?: boolean;
  isBorderless?: boolean;
}

export type PromoCodeProps = {
  isApplyButtonDisabled?: boolean,
  handleApplyPromoCode?: () => void,
  handlePromoCodeInputChange: (value: string) => void,
  promoCodeError?: string | null,
  promoCodeValue?: string,
  hasPromoCode: boolean,
  setHasPromoCode: (status: boolean) => void,
  promoCodeStatus: {
    isApplied: boolean;
    code: string;
    discount: number;
    finalAmount: number;
    firstPayment: number;
    secondPayment: number;
    skipPayment: boolean;
  },
  onRemovePromo?: () => void,
}
