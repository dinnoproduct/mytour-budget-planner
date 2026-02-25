import {
  type NormalizedRequestEntity,
  type PackageEntity,
} from "../model/entities";

export const transformRequestToPackage = (
  request: NormalizedRequestEntity,
): PackageEntity => {
  const transformedPackage: Partial<PackageEntity> = {
    offerId: -1,
    id: request.id,
    price: request.remainingPaymentAmount,
    hotel: {
      id: request.hotel.id,
      name: request.hotel.name,
      website: request.hotel.website,
      stars: request.hotel.stars,
      cleanliness: request.hotel.cleanliness,
      travellersRating: request.hotel.travellersRating,
      facilities: request.hotel.facilities,
      descriptionArm: request.hotel.descriptionArm,
      descriptionEng: request.hotel.descriptionEng,
      descriptionRus: request.hotel.descriptionRus,
      images: request.hotel.images,
    },
    roomType: request.roomType,
    checkin: request.startDate,
    checkout: request.endDate,
    city: {
      id: request.hotel.city.id,
      nameArm: request.hotel.city.nameArm,
      nameEng: request.hotel.city.nameEng,
      nameRus: request.hotel.city.nameRus,
      countryId: request.hotel.city.countryId,
      country: request.hotel.city.country,
    },
    travelAgency: {
      id: request.travelAgencyId,
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      facebook: "",
      instagram: "",
      telegram: "",
      establishmentDate: "",
      contactPersonDetails: "",
    },
    infantTravelers: 0,
    usdRate: 0,
    currency: request.currency,
    rate: request.rate,
  };

  const notes = request.notes;
  transformedPackage.lateCheckout = !!(notes && notes.isLateCheckout);
  if (notes && Object.keys(notes).length > 0) {
    if (notes.adultTravelersCount) {
      transformedPackage.adultTravelers = notes.adultTravelersCount;
    }

    if (notes.totalTravelersCount) {
      transformedPackage.childrenTravelers = notes.childrenAges?.length || 0;
    }
  } else if (request.travelers && request.travelers.length > 0) {
    transformedPackage.adultTravelers = request.travelers.length;
    transformedPackage.childrenTravelers = 0;
  }

  if (request.destinationFlightId) {
    transformedPackage.destinationFlight = {
      id: request.destinationFlightId,
      departureDate: request.startDate,
      arrivalDate: "",
      airCompany: {
        id: 0,
        name: "",
      },
      ticketClass: 0,
      flightType: 0,
      fLightCode: "",
    };
  }

  if (request.returnFlightId) {
    transformedPackage.returnFlight = {
      id: request.returnFlightId,
      departureDate: request.endDate,
      arrivalDate: "",
      airCompany: {
        id: 0,
        name: "",
      },
      ticketClass: 0,
      flightType: 0,
      fLightCode: "",
    };
  }

  return transformedPackage as PackageEntity;
};
