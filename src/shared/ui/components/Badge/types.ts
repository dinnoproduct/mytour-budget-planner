import { FlexProps } from '@chakra-ui/react'

export type StatusOnImageBadgeProps = {
	status: BadgeStatus
} & BadgeProps

export type BadgeProps = {
	isPositionAbsolute?: boolean
} & FlexProps

export type BadgeStatus =
	'allInclusive'
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