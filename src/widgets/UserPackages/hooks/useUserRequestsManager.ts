import {
  type RequestEntity,
  RequestStatus,
  usePayRemainingAmount,
  useUserRequests
} from '@entities/package'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useModalContext } from '@app/providers'
import { useSnackBar } from '@ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export const useUserRequestsManager = () => {
  const { t } = useTranslation()
  const { emitSnackBar } = useSnackBar()
  const { data: userRequests, isLoading: isLoadingUserRequests } =
    useUserRequests()
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [activeRequests, setActiveRequests] = useState<RequestEntity[]>([])
  const [pendingRequests, setPendingRequests] = useState<RequestEntity[]>([])
  const [passedRequests, setPassedRequests] = useState<RequestEntity[]>([])
  const [cancelledRequests, setCancelledRequests] = useState<RequestEntity[]>(
    []
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = useMemo(
    () => parseInt(searchParams.get('tab') || '0'),
    [searchParams]
  )

  useEffect(() => {
    if (isLoadingUserRequests) return

    if (userRequests?.length) {
      const today = moment()

      const active = userRequests.filter(
        request =>
          [
            RequestStatus.InProcess,
            RequestStatus.Booked,
            RequestStatus.Rejected,
            RequestStatus.Overdue
          ].includes(request.status) ||
          (request.status === RequestStatus.Purchased &&
            moment(request.endDate).isAfter(today))
      )

      const pending = userRequests.filter(request =>
        [RequestStatus.Draft, RequestStatus.NotPaid].includes(request.status)
      )

      const passed = userRequests.filter(
        request =>
          request.status === RequestStatus.Purchased &&
          moment(request.endDate).isBefore(today)
      )

      const cancelled = userRequests.filter(
        request => request.status === RequestStatus.Cancelled
      )

      setActiveRequests(active)
      setPendingRequests(pending)
      setPassedRequests(passed)
      setCancelledRequests(cancelled)
    }

    setIsLoadingRequests(false)
  }, [userRequests, isLoadingUserRequests])

  const {
    mutateAsync: payRemainingAmountAsync,
    isPending: isLoadingRemainingPayment
  } = usePayRemainingAmount()
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null)

  const handleRemainingPaymentClick = async (requestId: number) => {
    setCurrentRequestId(requestId)

    try {
      await payRemainingAmountAsync(requestId)
    } catch (error) {
      return
    } finally {
      setCurrentRequestId(null)
    }
  }

  const { dispatchModal } = useModalContext()

  const handleCancelClick = (requestId: number) => {
    dispatchModal({
      type: 'open',
      modalType: 'requestCancel',
      props: {
        requestId,
        onSuccess: () => {
          emitSnackBar({
            status: 'success',
            title: t`bookingCanceledSnackbar`
          })
          setSearchParams({ tab: '2' })
        }
      }
    })
  }

  const handleTabChange = (index: number) => {
    setSearchParams({ tab: index.toString() })
  }

  return {
    activeRequests,
    pendingRequests,
    passedRequests,
    cancelledRequests,
    handleRemainingPaymentClick,
    isLoadingRemainingPayment,
    currentRequestId,
    handleCancelClick,
    tab,
    handleTabChange,
    isLoadingUserRequests: isLoadingRequests
  }
}
