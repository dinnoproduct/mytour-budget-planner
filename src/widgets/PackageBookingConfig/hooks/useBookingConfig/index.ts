import { useEffect, useMemo, useState } from 'react'
import {
	DictionaryTypes,
	PackageEntity,
	useAvailableFlights, useCurrentOfferPackage,
	useDictionary,
	useGenerateOffers,
	useReturnFlights
} from '@entities/package'
import moment from 'moment/moment'
import { DatePickerProps } from '@features/DatePicker/ui/types.ts'
import { useSearchParams } from 'react-router-dom'
import { SearchTravelersProps } from '@features/SearchTravelers/ui/types.ts'
import { RoomsMenuProps } from '@features/RoomsMenu/ui/types.ts'

export const useBookingConfig = (defaultTourPackage: PackageEntity) => {
	const [searchParams] = useSearchParams()
	const [bookingData, setBookingData] = useState({
		fromDate: new Date(defaultTourPackage.destinationFlight.departureDate),
		toDate: new Date(defaultTourPackage.returnFlight.arrivalDate),
		departureFlightId: defaultTourPackage.destinationFlight.id,
		returnFlightId: defaultTourPackage.returnFlight.id,
		travelersData: {
			adultsCount: defaultTourPackage.adultTravelers,
			childrenCount: defaultTourPackage.childrenTravelers + defaultTourPackage.infantTravelers,
			childrenAges: searchParams.get('childrenAges')?.split(',').filter(Boolean).map(Number) || []
		},
		hotelId: defaultTourPackage.hotel.id,
		lateCheckout: false,
		roomId: defaultTourPackage.roomType
	})
	const updateBookingData = (data: Partial<typeof bookingData>) => {
		setBookingData(prevState => ({
			...prevState,
			...data
		}))
	}

	// flight
	const { data: departureFlights } = useAvailableFlights({ city: 1 })
	const {
		data: returnFlights,
		isLoading: isLoadingReturnFlights
	} = useReturnFlights({
		flightId: bookingData.departureFlightId as number
	}, {
		enabled: !!bookingData.departureFlightId
	})

	const availableDepartureDates = useMemo(() => {
		if (!departureFlights?.length) return []
		return departureFlights.map(flight => new Date(flight.departureDate))
	}, [JSON.stringify(departureFlights)])

	const availableReturnDates = useMemo(() => {
		if (!returnFlights?.length) return []
		return returnFlights.map(flight => new Date(flight.arrivalDate))
	}, [JSON.stringify(returnFlights)])

	const handleFromDateClick = (date: Date) => {
		const selectedFlight = departureFlights?.find(flight => moment(flight.departureDate).isSame(date, 'day'))

		if (selectedFlight) {
			updateBookingData({
				departureFlightId: selectedFlight.id
			})
		}
	}

	const handleFlightConfirm = (fromDate: Date, toDate?: Date | null) => {
		if (!fromDate || !toDate) return

		const returnFlight = returnFlights?.find(flight => moment(flight.arrivalDate).isSame(toDate, 'day'))

		updateBookingData({
			fromDate,
			toDate,
			returnFlightId: returnFlight?.id
		})
	}

	// offers
	const { data: offers = [], isLoading: isLoadingOffers } = useGenerateOffers({
		flightId: bookingData.departureFlightId as number,
		returnFlightId: bookingData.returnFlightId as number,
		adults: bookingData.travelersData.adultsCount,
		childs: bookingData.travelersData.childrenAges,
		hotelId: bookingData.hotelId as number,
		lateCheckout: bookingData.lateCheckout
	}, {
		enabled: true
	})

	// rooms
	const { data: roomTypes = [] } = useDictionary('RoomTypeDictionary' as DictionaryTypes.RoomTypeDictionary)
	const roomOffers = useMemo(() => {
		if (!offers?.length) return []

		const offerRoomTypes = roomTypes.filter(roomType => offers.some(offer => offer.roomType === roomType.key))
		return offerRoomTypes.map(roomType => {
			const offer = offers.find(offer => offer.roomType === roomType.key)
			return {
				id: roomType.key,
				name: roomType.value,
				price: offer?.price || 0
			}
		}).sort((a, b) => a.price - b.price)
	}, [JSON.stringify(offers), JSON.stringify(roomTypes)])

	const isNotFound = useMemo(() => !isLoadingOffers && roomOffers.length === 0, [roomOffers?.length, isLoadingOffers])

	const defaultRoomOffer = useMemo(() => {
		return roomOffers.find(room => room.id === bookingData.roomId) || roomOffers[0]
	}, [JSON.stringify(roomOffers), bookingData.roomId])

	const handleRoomSelect = (roomId: number) => {
		updateBookingData({
			roomId
		})
	}

	const selectedOffer = useMemo(() => {
		return offers.find(offer => offer.roomType === bookingData.roomId)
	}, [bookingData.roomId, JSON.stringify(offers)])


	console.log('')
	const {
		data: currentOfferPackage,
		refetch: refetchCurrentOfferPackage,
		isFetching: isFetchingCurrentOfferPackage
	} = useCurrentOfferPackage(
		selectedOffer?.offerId || 0,
		{
			enabled: !!selectedOffer?.offerId
		}
	)


	useEffect(() => {
		refetchCurrentOfferPackage()
	}, [selectedOffer?.offerId, refetchCurrentOfferPackage])

	return {
		bookingData,
		selectedOffer,
		updateBookingData,
		isNotFound,
		flightsDatePickerProps: {
			fromDate: bookingData.fromDate,
			toDate: bookingData.toDate,
			onAccept: handleFlightConfirm,
			onFromDateClick: handleFromDateClick,
			availableDepartureDates,
			availableReturnDates,
			isLoadingReturnDates: isLoadingReturnFlights
		} as DatePickerProps,
		searchTravelersProps: {
			defaultData: bookingData.travelersData,
			onChange: (travelersData) => updateBookingData({ travelersData })
		} as SearchTravelersProps,
		roomsMenuProps: {
			rooms: roomOffers,
			defaultRoom: defaultRoomOffer?.id,
			onChange: handleRoomSelect
		} as RoomsMenuProps,
		isLoadingTourPackage: isFetchingCurrentOfferPackage
	}
}