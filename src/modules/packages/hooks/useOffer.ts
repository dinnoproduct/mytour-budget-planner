import { useState } from 'react';
import { generateOfferService } from '../services/PackagesServices.ts';
import { type IGeneratedOffer, type IGenerateOffer } from '../data/packagesTypes.ts';
import { useRecoilState } from 'recoil';
import { generatedOffersAtom } from '../store/store.ts';

const useOffer = () => {
  const [loading, setLoading] = useState(false);
  const [generatedOffers, setGeneratedOffers] = useRecoilState(generatedOffersAtom);

  const generateOffers = (data: IGenerateOffer, onSuccess: (data: IGeneratedOffer[]) => void) => {
    setLoading(true);
    void generateOfferService(data)
      .then(({ data }) => {
        setGeneratedOffers(data);
        onSuccess?.(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return { generatedOffers, generateOffers, loading };
};

export default useOffer;
