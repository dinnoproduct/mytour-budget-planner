import { useState } from 'react';
import {
  getAvailableFlightsService,
  getFlightsByDateService,
  getReturnFlightsService,
} from '../services/PackagesServices';
import { useRecoilState } from 'recoil';
import { availableFlightsAtom, flightByDateAtom, returnFlightsAtom } from '../store/store';

const useFlight = () => {
  const [loading, setLoading] = useState(false);
  const [returnFlightLoading, setReturnFlightLoading] = useState(false);
  const [availableFlights, setAvailableFlights] = useRecoilState(availableFlightsAtom);
  const [returnFlights, setReturnFlights] = useRecoilState(returnFlightsAtom);
  const [flightsByDate, setFlightsByDate] = useRecoilState(flightByDateAtom);

  const getAvailableFlights = (travelAgency: number, city: number) => {
    setLoading(true);
    void getAvailableFlightsService(travelAgency, city)
      .then(({ data }) => setAvailableFlights(data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFlightsByDate = ({ date, travelAgency, city }: { date: string; travelAgency: number; city: number }) => {
    setLoading(true);
    setReturnFlights([]);
    void getFlightsByDateService({ date, travelAgency, city })
      .then(({ data }) => {
        setFlightsByDate(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getReturnFlights = (id: number) => {
    setReturnFlightLoading(true);
    void getReturnFlightsService(id)
      .then(({ data }) => {
        setReturnFlights(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setReturnFlightLoading(false);
      });
  };

  return {
    loading,
    returnFlightLoading,
    availableFlights,
    returnFlights,
    flightsByDate,
    getAvailableFlights,
    getReturnFlights,
    getFlightsByDate,
  };
};

export default useFlight;
