import { type FlexProps } from '@chakra-ui/react'
import { type TextProps } from '@shared/ui/foundation/Typography/types'

export type StatusOnImageBadgeProps = {
  status: BadgeStatus
  textProps?: Omit<TextProps, 'children'>
} & BadgeProps

export type BadgeProps = {
  isPositionAbsolute?: boolean
} & FlexProps

export type BadgeStatus =
  | 'foodType'
  | 'specialOffer'
  | 'notFinished'
  | 'paid'
  | 'canceled'
  | 'rejected'
  | 'paidPartially'
  | 'unfinished'
  | 'expired'
  | 'soldOut'
  | 'inProgress'
  | 'notAvailable'
  | 'paymentIssue'
  | 'reserved'
