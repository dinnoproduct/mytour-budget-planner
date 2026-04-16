import axios, { type AxiosInstance } from "axios";
import {
  type FlightEntity,
  type GetFlightsByDateParams,
} from "@entities/package";
import {
  type GetAvailableFlightsParams,
  type GetReturnFlightsParams,
} from "@entities/package/api/types";

export class FlightService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/flight`,
    });

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error),
    );
  }

  async getAvailableFlights({
    destinationId,
  }: GetAvailableFlightsParams): Promise<FlightEntity[]> {
    return this.api("getAvailableFlights", {
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/V2/flight`,
      params: {
        destinationId,
      },
    });
  }

  async getReturnFlights(
    input: FlightEntity,
    { destinationId }: GetReturnFlightsParams,
  ): Promise<FlightEntity[]> {
    return this.api("getReturnAirTicketsDates", {
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/V2/flight`,
      params: {
        destinationId,
      },
      method: "post",
      data: input,
    });
  }

  async getFlightsByDate(
    params: GetFlightsByDateParams,
  ): Promise<FlightEntity[]> {
    return this.api("getAirTicketsByDate", {
      params,
    });
  }
}
