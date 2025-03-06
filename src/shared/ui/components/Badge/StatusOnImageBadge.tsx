import { Flex, type FlexProps } from '@chakra-ui/react'
import { Text } from '@ui'
import { useMemo } from 'react'
import {
  type BadgeProps,
  type StatusOnImageBadgeProps
} from '@components/Badge/types.ts'
import { useTranslation } from 'react-i18next'

export const PaginationBadge = ({
  currentIndex,
  imagesCount,
  isPositionAbsolute,
  ...props
}: {
  currentIndex: number
  imagesCount: number
  isPositionAbsolute?: boolean
} & FlexProps) => (
  <Flex
    position="absolute"
    bottom="2"
    left="2"
    bgColor="blackAlpha.500"
    color="white"
    px="2"
    height="20px"
    rounded="full"
    fontSize="sm"
    align="center"
    {...props}
  >
    <Text size="xs" color="white">
      {currentIndex + 1}/{imagesCount}
    </Text>
  </Flex>
)

export const StatusOnImageBadge = ({
  status,
  ...props
}: StatusOnImageBadgeProps) => {
  const badge = useMemo(() => {
    const statusMap = {
      breakfastOnly: <BreakfastOnlyBadge {...props} />,
      allInclusive: <AllInclusiveBadge {...props} />,
      specialOffer: <SpecialOfferBadge {...props} />,
      notFinished: <NotFinishedBadge {...props} />,
      paid: <PaidBadge {...props} />,
      canceled: <CanceledBadge {...props} />,
      rejected: <RejectedBadge {...props} />,
      paidPartially: <PartiallyPaidBadge {...props} />,
      unfinished: <UnfinishedBadge {...props} />,
      expired: <ExpiredBadge {...props} />,
      soldOut: <SoldOutBadge {...props} />,
      inProgress: <InProgressBadge {...props} />,
      notAvailable: <NotAvailableBadge {...props} />,
      paymentIssue: <PaymentIssueBadge {...props} />
    }

    return statusMap[status]
  }, [status])

  return badge
}

const AllInclusiveBadge = ({ ...props }: BadgeProps) => (
  <Layout status="success" textKey="All Inclusive" {...props} />
)

const BreakfastOnlyBadge = ({ ...props }: BadgeProps) => (
  <Layout status="success" textKey="breakfastOnly" {...props} />
)

const SpecialOfferBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="specialOffer" {...props} />
)

const NotFinishedBadge = ({ ...props }: BadgeProps) => (
  <Layout status="warning" textKey="draft" {...props} />
)

const InProgressBadge = ({ ...props }: BadgeProps) => (
  <Layout status="warning" textKey="inProgress" {...props} />
)

const PaidBadge = ({ ...props }: BadgeProps) => (
  <Layout status="success" textKey="purchased" {...props} />
)

const CanceledBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="canceled" {...props} />
)

const RejectedBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="rejected" {...props} />
)

const PartiallyPaidBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="partiallyPaid" {...props} />
)

const UnfinishedBadge = ({ ...props }: BadgeProps) => (
  <Layout status="warning" textKey="unfinished" {...props} />
)

const ExpiredBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="overduePayment" {...props} />
)

const SoldOutBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="sold" {...props} />
)

const NotAvailableBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="notAvailable" {...props} />
)

const PaymentIssueBadge = ({ ...props }: BadgeProps) => (
  <Layout status="error" textKey="paymentIssue" {...props} />
)

export const Layout = ({
  status,
  textKey,
  ...props
}: {
  status: 'success' | 'warning' | 'error'
  textKey: string
} & FlexProps) => {
  const { t } = useTranslation()

  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      bgColor={COLORS_MAP[status]}
      color="white"
      px="3"
      height="24px"
      rounded="8px 24px 24px 0px"
      fontSize="sm"
      align="center"
      {...props}
    >
      <Text size="xs" color="white" ml=".5">
        {t(textKey)}
      </Text>
    </Flex>
  )
}

const COLORS_MAP = {
  success: 'green.600',
  warning: 'orange.500',
  error: 'red.500'
}
