import { type RequestEntity, type RequestStatus } from '@entities/package'
import { type BoxProps } from '@chakra-ui/react'
import { type EmptyObject } from 'react-hook-form'

export type RequestCardProps = {
  request: RequestEntity | EmptyObject
  onRemainingPaymentClick?: (requestId: number) => void
  isLoadingRemainingPayment?: boolean
  status: 'upcoming' | 'incomplete' | 'past' | 'canceled'
  onCancelClick?: (requestId: number) => void
} & BoxProps

export type DetailsListItemProps = {
  label: string
  value: string | number
  isWithoutBorder?: boolean
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
