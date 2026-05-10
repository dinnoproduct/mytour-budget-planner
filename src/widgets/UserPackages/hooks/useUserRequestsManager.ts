import {
  type PackageEntity,
  type RequestEntity,
  RequestStatus,
  transformRequestToPackage,
  usePayRemainingAmount,
  useSearchHotelOfferPackage,
  useSearchOfferPackage,
  useUpdateRequest,
  useUserRequests,
  type NormalizedRequestEntity,
  useRequestCancellationMessageAsync,
  useGroupTourPackageFromRequest,
  isGroupTourSpecialBookingId
} from '@entities/package'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useModalContext } from '@app/providers'
import { useSnackBar } from '@ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { type EmptyObject } from 'global'

export const useUserRequestsManager = () => {
  const { t, i18n } = useTranslation()
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

      const hideSpecialGroupTourFromMyPackages = (
        request: NormalizedRequestEntity,
      ) => isGroupTourSpecialBookingId(request.groupTourId)

      const visibleRequests = normalUserRequests.filter(
        (request) => !hideSpecialGroupTourFromMyPackages(request),
      )

      const active = visibleRequests.filter(
        request =>
          [
            RequestStatus.InProcess,
            RequestStatus.Booked,
            RequestStatus.Rejected,
            RequestStatus.Overdue,
            RequestStatus.Reserved
          ].includes(request.status) ||
          (request.status === RequestStatus.Purchased &&
            moment(request.endDate).isAfter(today))
      )

      const pending = visibleRequests
        .filter(request =>
          [RequestStatus.Draft, RequestStatus.NotPaid].includes(request.status)
        )
        .map(request => {
          if (request.status === RequestStatus.Draft) {
            const customStatus = moment(request.startDate).isBefore(today)
              ? 10
              : 1

            return {
              ...request,
              status: customStatus
            }
          }

          return request
        })

      const passed = visibleRequests.filter(
        request =>
          request.status === RequestStatus.Purchased &&
          moment(request.endDate).isBefore(today)
      )

      const cancelled = visibleRequests.filter(
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
      notes = JSON.parse(request.notes || '{}')
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
  const requestCancellationMessageAsync = useRequestCancellationMessageAsync()
  const [cancellingRequestId, setCancellingRequestId] = useState<number | null>(
    null
  )

  const handleCancelClick = async (requestId: number) => {
    setCancellingRequestId(requestId)

    try {
      const cancellationMessage = await requestCancellationMessageAsync(
        requestId,
        i18n.language as any
      )

      if (cancellationMessage) {
        dispatchModal({
          type: 'open',
          modalType: 'requestCancel',
          props: {
            requestId,
            cancellationMessage,
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
    } catch (error) {
      console.error('Failed to fetch cancellation message', error)
    } finally {
      setCancellingRequestId(null)
    }
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
  const [isActiveRequestDraft, setIsActiveRequestDraft] = useState(false)

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
    if (
      activeRequest &&
      (activeRequest.bookingType === 3 || (activeRequest as any).groupTourId)
    ) {
      return 'groupTour'
    }
    if (activeRequest?.destinationFlightId) {
      return 'package'
    }
    return 'hotel'
  }, [activeRequest?.destinationFlightId, activeRequest?.bookingType, (activeRequest as any)?.groupTourId])

  const {
    packageDetails: requestPackageData,
    isLoading: isLoadingRequestPackage
  } = useSearchOfferPackage(
    {
      adultsCount: activeRequest?.notes.adultTravelersCount || 0,
      childrenAges: activeRequest?.notes.childrenAges || [],
      flightId: activeRequest?.destinationFlightId || 0,
      returnFlightId: activeRequest?.returnFlightId || 0,
      dateFrom: activeRequest?.startDate || '',
      dateTo: activeRequest?.endDate || '',
      hotelId: activeRequest?.hotel.id || 0,
      roomId: activeRequest?.roomType || 0,
      lateCheckout: activeRequest?.notes.isLateCheckout || false,
      travelAgency: activeRequest?.travelAgencyId || 0
    },
    {
      enabled:
        !!activeRequest?.id &&
        !!activeRequest?.notes?.adultTravelersCount &&
        activeRequest?.status !== RequestStatus.Reserved &&
        activeRequestPackageType === 'package',

      onSuccess: handlePackageDetailsSuccess
    }
  )

  const {
    packageDetails: groupTourPackageData,
    isLoading: isLoadingGroupTourPackage
  } = useGroupTourPackageFromRequest(activeRequest, {
    enabled: activeRequestPackageType === 'groupTour'
  })

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
      roomId: activeRequest?.roomType || 0,
      mealId: activeRequest?.foodType || 0,
      travelAgency: activeRequest?.travelAgencyId || 0
    },
    {
      enabled:
        !!activeRequest?.id &&
        !!activeRequest?.notes.adultTravelersCount &&
        activeRequest?.status !== RequestStatus.Reserved &&
        activeRequestPackageType === 'hotel',
      onSuccess: handlePackageDetailsSuccess
    }
  )

  const [reservedPackage, setReservedPackage] = useState<PackageEntity | null>(
    null
  )
  const [reservedHotelPackage, setReservedHotelPackage] =
    useState<PackageEntity | null>(null)

  const activeRequestPackage = useMemo(
    () =>
      activeRequestPackageType === 'groupTour'
        ? groupTourPackageData ?? null
        : activeRequestPackageType === 'package'
          ? reservedPackage || requestPackageData
          : reservedHotelPackage || requestHotelPackage,
    [
      requestHotelPackage,
      requestPackageData,
      groupTourPackageData,
      activeRequestPackageType,
      reservedPackage,
      reservedHotelPackage
    ]
  )

  const isLoadingActiveRequestPackage = useMemo(
    () =>
      activeRequestPackageType === 'groupTour'
        ? isLoadingGroupTourPackage
        : activeRequestPackageType === 'package'
          ? isLoadingRequestPackage
          : isLoadingRequestHotelPackage,
    [
      isLoadingRequestHotelPackage,
      isLoadingRequestPackage,
      isLoadingGroupTourPackage,
      activeRequestPackageType
    ]
  )

  const handleContinueClick = (request: NormalizedRequestEntity) => {
    if (request.status === RequestStatus.Draft) {
      setIncompleteInitialView('travelers')
      setIsActiveRequestDraft(true)
    } else if (request.status === RequestStatus.NotPaid) {
      setIncompleteInitialView('payment')
      setIsActiveRequestDraft(true)
    } else if (request.status === RequestStatus.Reserved) {
      const isGroupTour =
        request.bookingType === 3 || !!(request as any).groupTourId
      if (!isGroupTour) {
        const transformedRequest = transformRequestToPackage(request)
        if (request.destinationFlightId) {
          setReservedPackage(transformedRequest)
        } else {
          setReservedHotelPackage(transformedRequest)
        }
      }

      setIncompleteInitialView('payment')
    }

    setActiveRequest(request)
  }

  const handleBookingFlowClose = () => {
    setActiveRequest(null)
    setIsActiveRequestDraft(false)
    setReservedPackage(null)
    setReservedHotelPackage(null)
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
    cancellingRequestId,
    tab,
    handleTabChange,
    isLoadingUserRequests: isLoadingRequests,
    handleContinueClick,
    activeRequest,
    handleBookingFlowClose,
    activeRequestPackage,
    incompleteInitialView,
    isActiveRequestDraft,
    isLoadingActiveRequestPackage
  }
}
