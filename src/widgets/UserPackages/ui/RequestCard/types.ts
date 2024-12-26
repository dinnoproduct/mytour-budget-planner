import { type RequestStatus } from '@entities/package'
import { type BoxProps } from '@chakra-ui/react'
import { type RequestsGroupStatus } from '@widgets/UserPackages/ui/types.ts'
import { type NormalizedRequestEntity } from '@widgets/UserPackages/model/types.ts'

export type RequestCardProps = {
  request: NormalizedRequestEntity
  onRemainingPaymentClick?: (requestId: number) => void
  isLoadingRemainingPayment?: boolean
  status: RequestsGroupStatus
  onCancelClick?: (requestId: number) => void
  onContinueClick?: (request: NormalizedRequestEntity) => void
  isLoadingContinue?: boolean
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
  | 10 // not available
  | 11 // sold out

export type ImagesSliderProps = {
  images: { url: string }[]
  starsCount: number
  status: RequestCardStatus
  showBadge?: boolean
}
