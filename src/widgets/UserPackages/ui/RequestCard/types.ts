import { type RequestStatus, type NormalizedRequestEntity } from '@entities/package'
import { type BoxProps } from '@chakra-ui/react'
import { type RequestsGroupStatus } from '@widgets/UserPackages/ui/types.ts'

export type RequestCardProps = {
  request: NormalizedRequestEntity
  onRemainingPaymentClick?: (requestId: number) => void
  isLoadingRemainingPayment?: boolean
  status: RequestsGroupStatus
  onCancelClick?: (requestId: number) => void
  onContinueClick?: (request: NormalizedRequestEntity) => void
  isLoadingContinue?: boolean
  cancellingRequestId?: number | null
} & BoxProps

export type DetailsListItemProps = {
  label: string
  value: string | number
  isWithoutBorder?: boolean
  tooltipText?: string
}

export type RequestCardStatus =
  | RequestStatus.Draft
  | RequestStatus.InProcess
  | RequestStatus.NotPaid
  | RequestStatus.Booked
  | RequestStatus.Purchased
  | RequestStatus.Rejected
  | RequestStatus.Overdue
  | RequestStatus.Reserved
  | 10 // not available
  | 11 // sold out

export type ImagesSliderProps = {
  images: { url: string }[]
  starsCount: number
  status: RequestCardStatus
  showBadge?: boolean
}
