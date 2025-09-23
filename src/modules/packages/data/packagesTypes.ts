import { type CustomFields, type PackagesFields, type PackagesNestedFields } from './packagesEnums.ts';

export interface IPackage {
  [PackagesFields.nameArm]: string;
  [PackagesFields.nameEng]: string;
  [PackagesFields.nameRus]: string;
  [PackagesFields.bookingPolicyArm]: string;
  [PackagesFields.bookingPolicyRus]: string;
  [PackagesFields.bookingPolicyEng]: string;
  [PackagesFields.cancelationPolicyArm]: string;
  [PackagesFields.cancelationPolicyRus]: string;
  [PackagesFields.cancelationPolicyEng]: string;
  [PackagesFields.offerId]: number;
  [PackagesFields.nights]: number;
  [PackagesFields.foodType]: number;
  [PackagesFields.price]: number;
  [PackagesFields.adultTravelers]: number;
  [PackagesFields.childrenTravelers]: number;
  [PackagesFields.roomType]: number;
  [PackagesFields.nights]: number;
  [PackagesFields.checkin]: string;
  [PackagesFields.checkout]: string;
  [PackagesFields.childMaxAge]: number;
  [PackagesFields.city]: {
    [PackagesFields.id]: number;
    [PackagesNestedFields.country]: {
      [PackagesFields.nameArm]: string;
      [PackagesFields.nameEng]: string;
      [PackagesFields.nameRus]: string;
    };
    [PackagesFields.nameArm]: string;
    [PackagesFields.nameEng]: string;
    [PackagesFields.nameRus]: string;
  };
  [PackagesFields.hotel]: {
    [PackagesFields.id]: number;
    [PackagesFields.images]: {
      [PackagesFields.url]: string;
      [PackagesFields.size]: number;
    }[];
    [PackagesFields.stars]: number;
    [PackagesFields.facilities]: number;
    [PackagesFields.cleanliness]: number;
    [PackagesFields.travellersRating]: number;
    [PackagesFields.descriptionArm]: string;
    [PackagesFields.descriptionEng]: string;
    [PackagesFields.descriptionRus]: string;
  };
  [PackagesFields.destinationFlight]: {
    [PackagesFields.id]: number;
    [PackagesFields.departureDate]: string;
    [PackagesFields.ticketClass]: number;
    [PackagesFields.airCompany]: {
      [PackagesFields.name]: string;
    };
  };
  [PackagesFields.returnFlight]: {
    [PackagesFields.departureDate]: string;
    [PackagesFields.id]?: number;
  };
  [PackagesFields.travelAgency]: {
    [PackagesFields.id]: number;
  };
  [PackagesFields.lateCheckout]?: boolean;
  [PackagesFields.usdRate]?: number;
}

export interface IPackageTravelDetails {
  [CustomFields.destinationFlightDate]: string;
  // [CustomFields.returnFlightDate]: Record<string, string>;
  // [PackagesFields.destinationFlight]: Record<string, string>;
  [PackagesFields.lateCheckout]: boolean;
  [PackagesFields.adults]: number;
  [CustomFields.childrenUnderTwoYears]: number;
  [CustomFields.childrenOverTwoYears]: number;
  [PackagesFields.destinationFlight]: {
    [PackagesFields.id]: number;
    [PackagesFields.departureDate]: string;
    [PackagesFields.ticketClass]: number;
    [PackagesFields.airCompany]: {
      [PackagesFields.name]: string;
    };
  };
  [PackagesFields.returnFlight]: {
    [PackagesFields.departureDate]: string;
  };
  [PackagesFields.childs]: { birthdate: string }[];
}

export type TPackages = IPackage[];

export interface ICity {
  [PackagesFields.id]: number;
  [PackagesFields.nameArm]: string;
  [PackagesFields.nameEng]: string;
  [PackagesFields.nameRus]: string;
}

export type TCities = ICity[];

export type TOption = { value: number; label: string };

export type TOptions = TOption[];

export interface IFlight {
  [PackagesFields.id]: number;
  [PackagesFields.departureDate]: string;
  [PackagesFields.arrivalDate]: string;
  [PackagesFields.airCompany]: {
    [PackagesFields.id]: number;
    [PackagesFields.name]: string;
  };
  [PackagesFields.ticketClass]: number;
  [PackagesFields.flightType]: number;
  [PackagesFields.fLightCode]: number;
}

export type TFlights = IFlight[];

export interface IGenerateOffer {
  [PackagesFields.hotelId]: number;
  [PackagesFields.flightId]: number;
  [PackagesFields.returnFlightId]: number;
  [PackagesFields.adults]: number;
  [PackagesFields.childs]: number[];
  [PackagesFields.lateCheckout]: boolean;
}

export interface IGeneratedOffer {
  [PackagesFields.offerId]: number;
  [PackagesFields.roomType]: number;
  [PackagesFields.price]: number;
  [PackagesFields.nights]: number;
  [PackagesFields.checkin]: string;
  [PackagesFields.checkout]: string;
}

export interface IGenerateMultivendorOffer {
  [PackagesFields.hotelId]: number;
  [PackagesFields.dateFrom]: string;
  [PackagesFields.dateTo]: string;
  [PackagesFields.adults]: number;
  [PackagesFields.childs]: number[];
  [PackagesFields.lateCheckout]: boolean;
  [PackagesFields.bookingType]: number;
}

export interface IGeneratedMultivendorOffer {
  [PackagesFields.offerId]: number;
  [PackagesFields.roomType]: number;
  [PackagesFields.price]: number;
  [PackagesFields.nights]: number;
  [PackagesFields.checkin]: string;
  [PackagesFields.checkout]: string;
  [PackagesFields.foodType]: number;
  [PackagesFields.agency]: {
    [PackagesFields.id]: number;
    [PackagesFields.name]: string;
    address: string;
    phoneNumber: string;
    email: string;
    facebook: string;
    instagram: string;
    telegram: string;
    establishmentDate: string;
    contactPersonDetails: string;
  };
  [PackagesFields.priceInCurrency]: number;
  [PackagesFields.rate]: number;
  [PackagesFields.partnerPrice]: number;
  [PackagesFields.currency]: string;
  [PackagesFields.cancellationDate]: string;
  [PackagesFields.departureFlight]: {
    [PackagesFields.id]: number;
    [PackagesFields.departureDate]: string;
    [PackagesFields.airCompany]: {
      [PackagesFields.id]: number;
      [PackagesFields.name]: string;
    };
  };
  [PackagesFields.returnFlight]: {
    [PackagesFields.airCompany]: {
      [PackagesFields.id]: number;
    };
    [PackagesFields.departureDate]: string;
  };
}

export interface ITraveler {
  [PackagesFields.id]?: number;
  [PackagesFields.firstName]: string;
  [PackagesFields.lastName]: string;
  [PackagesFields.birthDate]?: string;
  [PackagesFields.dateOfBirth]?: string;
}

export interface IBookForm {
  [CustomFields.phoneNumber]: string;
  [CustomFields.email]: string;
  [PackagesFields.adults]: Partial<Omit<ITraveler, PackagesFields.id>>[];
  [PackagesFields.childs]: Partial<Omit<ITraveler, PackagesFields.id>>[];
}

export interface IBookRequest {
  [CustomFields.cityId]: number;
  [PackagesFields.price]: number;
  [CustomFields.startDate]: string;
  [CustomFields.endDate]: string;
  [CustomFields.travelAgencyId]: number;
  [CustomFields.notes]: string;
  [CustomFields.travelers]: ITraveler[];
  [PackagesFields.offerId]: number;
  [PackagesFields.usdRate]: number;
  [CustomFields.destinationFlightId]: number;
  [CustomFields.returnFlightId]: number;
  [CustomFields.hotelId]: number;
  [PackagesFields.roomType]: number;
  [CustomFields.email]: string;
  [CustomFields.phoneNumber]: string;
  [PackagesFields.amountToBePaid]: number;
}

export interface IBookResponse {
  success: boolean;
  message: string;
  bookingPaymentUrl: string;
}
