import { request } from '../../../services/RequestService.ts';
import { ApiUrls, Methods } from '../../../constants/constants.ts';
import {
  IGeneratedMultivendorOffer,
  IGenerateMultivendorOffer,
  type IBookRequest,
  type IBookResponse,
  type IGeneratedOffer,
  type IGenerateOffer,
  type IPackage,
  type TCities,
  type TFlights,
  type TPackages,
} from '../data/packagesTypes.ts';
import { type IDictionary } from '../data/dictionaryTypes.ts';
import { type DictionaryTypes } from '../data/dictionaryEnum.ts';
import { type CustomFields } from '../data/packagesEnums.ts';

export const getPackagesService = (): Promise<{ data: TPackages }> =>
  request(Methods.GET, `/${ApiUrls.api}/${ApiUrls.package}/${ApiUrls.V2}/${ApiUrls.getPackages}`);

export const getPackageService = (id: number): Promise<{ data: IPackage }> =>
  request(Methods.GET, `/${ApiUrls.api}/${ApiUrls.package}/${ApiUrls.getPackage}?id=${id}`);

export const getCitiesService = (): Promise<{ data: TCities }> =>
  request(Methods.GET, `/${ApiUrls.api}/${ApiUrls.city}/${ApiUrls.getCities}`);

export const getDictionaryService = (
  language: number,
  dictionaryType: DictionaryTypes,
): Promise<{ data: IDictionary[] }> =>
  request(Methods.GET, `/${ApiUrls.api}/${ApiUrls.common}/${`get${dictionaryType}`}?language=${language}`);

export const getAvailableFlightsService = (travelAgency: number, city: number): Promise<{ data: TFlights }> =>
  request(
    Methods.GET,
    `/${ApiUrls.api}/${ApiUrls.flight}/${ApiUrls.getAvailableFlights}?travelAgency=${travelAgency}&city=${city}`,
  );

export const getReturnFlightsService = (id: number): Promise<{ data: TFlights }> =>
  request(Methods.GET, `/${ApiUrls.api}/${ApiUrls.flight}/${ApiUrls.getReturnAirTickets}?id=${id}`);

export const getFlightsByDateService = ({
  date,
  travelAgency,
  city,
}: {
  date: string;
  travelAgency: number;
  city: number;
}): Promise<{ data: TFlights }> =>
  request(
    Methods.GET,
    `/${ApiUrls.api}/${ApiUrls.flight}/${ApiUrls.getAirTicketsByDate}?date=${date}&travelAgency=${travelAgency}&city=${city}`,
  );

export const subscribeService = (email: string): Promise<{ data: boolean }> =>
  request(Methods.POST, `/${ApiUrls.api}/${ApiUrls.subscription}/${ApiUrls.subscribe}`, {
    data: email,
    headers: { 'Content-Type': 'application/json-patch+json' },
  });

export const generateOfferService = (data: IGenerateOffer): Promise<{ data: IGeneratedOffer[] }> =>
  request(Methods.POST, `/${ApiUrls.api}/${ApiUrls.package}/${ApiUrls.generateOffers}`, {
    data,
  });

export const generateMultivendorOfferService = (data: IGenerateMultivendorOffer): Promise<{ data: IGeneratedMultivendorOffer[] }> => {
  // todo: remove this
  const baseUrl = import.meta.env.VITE_API_URL;
  return request(Methods.POST, `${baseUrl}/${ApiUrls.V2}/${ApiUrls.package}/${ApiUrls.generateMultivendorOffers}`, {
    headers: { 'Content-Type': 'application/json-patch+json' },
    data,
  })
};

export const updateUserService = (token: string): Promise<{ data: { [CustomFields.email]: string } }> =>
  request(Methods.POST, `/${ApiUrls.api}/${ApiUrls.user}`, { headers: { Authorization: `Bearer ${token}` } });

export const bookPackageService = (data: IBookRequest, token: string): Promise<{ data: IBookResponse }> =>
  request(Methods.POST, `/${ApiUrls.api}/${ApiUrls.request}/${ApiUrls.book}`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
