import { useLocation } from 'react-router-dom'
import {
  type PackageEntity,
  type OfferEntity,
  packageUseCases
} from '@entities/package'
import { type EmptyObject } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'

type Options = {
  onSuccess?: (packageDetails: PackageEntity | EmptyObject) => void
}

export const useSearchHotelPackage = (options?: Options) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const adultsCount = parseInt(searchParams.get('adultsCount') || '0', 10)
  const childrenAgesParam = searchParams.get('childrenAges')
  const childrenAges = childrenAgesParam
    ? childrenAgesParam?.split(',').filter(Boolean).map(Number) || []
    : []
  const hotelId = parseInt(searchParams.get('hotelId') || '0', 10)
  const roomId = parseInt(searchParams.get('roomId') || '0', 10)
  const mealId = parseInt(searchParams.get('mealId') || '0', 10)
  const travelAgency = parseInt(searchParams.get('travelAgency') || '0', 10)

  // State management
  const [packageDetails, setPackageDetails] = useState<PackageEntity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const checkin = useMemo(
    () =>
      from ? moment(from).set({ hour: 14 }).format('ddd MMM DD YYYY') : '',
    [from]
  )
  const checkout = useMemo(
    () => (to ? moment(to).set({ hour: 12 }).format('ddd MMM DD YYYY') : ''),
    [to]
  )

  // Single useEffect with sequential async calls
  useEffect(() => {
    const fetchData = async () => {
      if (!checkin || !checkout || !hotelId || hasInitialized) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Step 1: Generate hotel offers
        const offers = await packageUseCases.generateHotelOffers({
          checkin,
          checkout,
          adults: adultsCount,
          childs: childrenAges,
          hotelId,
          travelAgency
        })

        // Step 2: Find offer ID
        let offerId = 0
        if (offers?.length) {
          if (mealId && roomId) {
            offerId = offers.find(
              offer => offer.roomType === roomId && offer.foodType === mealId
            )?.offerId || 0
          } else if (roomId) {
            offerId = offers.find(offer => offer.roomType === roomId)?.offerId || 0
          } else {
            offerId = offers[0].offerId || 0
          }
        }

        // Step 3: Get hotel package
        if (offerId && travelAgency) {
          const packageData = await packageUseCases.getHotelPackage(offerId, travelAgency)
          setPackageDetails(packageData)
          setHasInitialized(true)
        } else {
          // No offers available, set packageDetails to null
          setPackageDetails(null)
          setHasInitialized(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // Only run once on mount

  // Handle success callback
  useEffect(() => {
    if (options?.onSuccess && packageDetails?.offerId) {
      options.onSuccess(packageDetails)
    }
  }, [packageDetails, options])

  return {
    packageDetails,
    isLoading,
    isFetched: hasInitialized,
    error
  }
}
