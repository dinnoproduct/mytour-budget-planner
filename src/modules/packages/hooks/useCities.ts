import { useEffect, useState } from 'react';
import { getCitiesService } from '../services/PackagesServices.ts';
import { useRecoilState } from 'recoil';
import { citiesAtom } from '../store/store.ts';

const useCities = () => {
  const [cities, setCities] = useRecoilState(citiesAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    void getCitiesService()
      .then(({ data }) => {
        setCities(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, cities };
};

export default useCities;
