import {
  type PackageEntity,
  type RequestEntity,
  RequestStatus,
  usePayRemainingAmount,
  useSearchHotelOfferPackage,
  useSearchOfferPackage,
  useUpdateRequest,
  useUserRequests
} from '@entities/package'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useModalContext } from '@app/providers'
import { useSnackBar } from '@ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { type NormalizedRequestEntity } from '@widgets/UserPackages/model/types.ts'
import { type EmptyObject } from 'global'

export const useUserRequestsManager = () => {
  const { t } = useTranslation()
  const { emitSnackBar } = useSnackBar()
  const { mutate: updateRequest } = useUpdateRequest()
  const { data: userRequests, isLoading: isLoadingUserRequests } =
    useUserRequests()
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [activeRequests, setActiveRequests] = useState<
    NormalizedRequestEntity[]
  >([])
  const [pendingRequests, setPendingRequests] = useState<
    NormalizedRequestEntity[]
  >([])
  const [passedRequests, setPassedRequests] = useState<
    NormalizedRequestEntity[]
  >([])
  const [cancelledRequests, setCancelledRequests] = useState<
    NormalizedRequestEntity[]
  >([])
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = useMemo(
    () => parseInt(searchParams.get('tab') || '0'),
    [searchParams]
  )

  useEffect(() => {
    if (isLoadingUserRequests) return

    if (userRequests?.length) {
      const today = moment()

      const normalUserRequests = userRequests.map(normalizeRequest)

      const active = normalUserRequests.filter(
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

      const pending = normalUserRequests
        .filter(request =>
          [RequestStatus.Draft, RequestStatus.NotPaid].includes(request.status)
        )
        .map(request => {
          if (request.status === RequestStatus.Draft) {
            const customStatus = request.notes?.isSoldOut
              ? 11
              : moment(request.startDate).isBefore(today)
                ? 10
                : 1

            return {
              ...request,
              status: customStatus
            }
          }

          return request
        })

      const passed = normalUserRequests.filter(
        request =>
          request.status === RequestStatus.Purchased &&
          moment(request.endDate).isBefore(today)
      )

      const cancelled = normalUserRequests.filter(
        request => request.status === RequestStatus.Cancelled
      )

      setActiveRequests(active)
      setPendingRequests(pending)
      setPassedRequests(passed)
      setCancelledRequests(cancelled)
    }

    setIsLoadingRequests(false)
  }, [userRequests, isLoadingUserRequests])

  const normalizeRequest = (
    request: RequestEntity
  ): NormalizedRequestEntity => {
    let notes = {}

    try {
      notes = JSON.parse(request.notes)
    } catch (e) {
      console.error('Failed to parse request notes', e)
    }

    return {
      ...request,
      notes: notes as NormalizedRequestEntity['notes']
    }
  }

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

  // incomplete requests
  const [incompleteInitialView, setIncompleteInitialView] = useState<
    'travelers' | 'payment'
  >('travelers')
  const [activeRequest, setActiveRequest] =
    useState<NormalizedRequestEntity | null>(null)

  const handlePackageDetailsSuccess = (
    packageDetails: PackageEntity | EmptyObject
  ) => {
    if (!packageDetails.offerId && activeRequest?.id) {
      emitSnackBar({
        status: 'error',
        title: 'sold out'
      })
      const updatedRequest = {
        ...activeRequest,
        notes: {
          ...activeRequest.notes,
          isSoldOut: true
        }
      }
      updateRequest({
        id: activeRequest.id,
        notes: JSON.stringify(updatedRequest.notes)
      })
      const newPendingRequests = pendingRequests.map(request =>
        request.id === activeRequest.id
          ? { ...updatedRequest, status: 11 }
          : request
      )
      setPendingRequests(newPendingRequests)
    }
  }

  const activeRequestPackageType = useMemo(() => {
    if (activeRequest?.destinationFlightId) {
      return 'package'
    }

    return 'hotel'
  }, [activeRequest?.destinationFlightId])

  const {
    packageDetails: requestPackageData,
    isLoading: isLoadingRequestPackage
  } = useSearchOfferPackage(
    {
      adultsCount: activeRequest?.notes.adultTravelersCount || 0,
      childrenAges: activeRequest?.notes.childrenAges || [],
      flightId: activeRequest?.destinationFlightId || 0,
      returnFlightId: activeRequest?.returnFlightId || 0,
      hotelId: activeRequest?.hotel.id || 0,
      roomId: activeRequest?.roomType || 0,
      lateCheckout: activeRequest?.notes.isLateCheckout || false
    },
    {
      enabled:
        !!activeRequest?.id &&
        !!activeRequest?.notes.adultTravelersCount &&
        activeRequestPackageType === 'package',
      onSuccess: handlePackageDetailsSuccess
    }
  )

  const {
    packageDetails: requestHotelPackage,
    isLoading: isLoadingRequestHotelPackage
  } = useSearchHotelOfferPackage(
    {
      adultsCount: activeRequest?.notes.adultTravelersCount || 0,
      childrenAges: activeRequest?.notes.childrenAges || [],
      from: activeRequest?.startDate || '',
      to: activeRequest?.endDate || '',
      hotelId: activeRequest?.hotel.id || 0,
      roomId: activeRequest?.roomType || 0
    },
    {
      enabled:
        !!activeRequest?.id &&
        !!activeRequest?.notes.adultTravelersCount &&
        activeRequestPackageType === 'hotel',
      onSuccess: handlePackageDetailsSuccess
    }
  )

  const activeRequestPackage = useMemo(
    () =>
      activeRequestPackageType === 'package'
        ? requestPackageData
        : requestHotelPackage,
    [requestHotelPackage, requestPackageData, activeRequestPackageType]
  )

  const isLoadingActiveRequestPackage = useMemo(
    () =>
      activeRequestPackageType === 'package'
        ? isLoadingRequestPackage
        : isLoadingRequestHotelPackage,
    [
      isLoadingRequestHotelPackage,
      isLoadingRequestPackage,
      activeRequestPackageType
    ]
  )

  const handleContinueClick = (request: NormalizedRequestEntity) => {
    if (request.status === RequestStatus.Draft) {
      setIncompleteInitialView('travelers')
    } else if (request.status === RequestStatus.NotPaid) {
      setIncompleteInitialView('payment')
    }

    setActiveRequest(request)
  }

  const handleBookingFlowClose = () => {
    setActiveRequest(null)
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
    isLoadingUserRequests: isLoadingRequests,
    handleContinueClick,
    activeRequest,
    handleBookingFlowClose,
    activeRequestPackage,
    isLoadingActiveRequestPackage,
    incompleteInitialView
  }
}
