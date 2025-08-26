import { useState } from "react";
import { useRecoilState } from "recoil";
import { generateMultivendorOfferService } from "../services/PackagesServices";
import { generatedMultivendorOffersAtom } from "../store/store";
import { type IGeneratedMultivendorOffer, type IGenerateMultivendorOffer } from "../data/packagesTypes";

const useMultivendorOffer = () => {
    const [loading, setLoading] = useState(false);
    const [generatedMultivendorOffers, setGeneratedMultivendorOffers] = useRecoilState(generatedMultivendorOffersAtom);

    const generateMultivendorOffers = (data: IGenerateMultivendorOffer, onSuccess?: (data: IGeneratedMultivendorOffer[]) => void) => {
        setLoading(true);
        void generateMultivendorOfferService(data)
            .then(({ data }) => {
                setGeneratedMultivendorOffers(data);
                onSuccess?.(data);
            })
            .catch((error) => {
                console.error('Error generating multivendor offers:', error);
                // You can add error state management here if needed
            })
            .finally(() => setLoading(false));
    };

    return { generatedMultivendorOffers, generateMultivendorOffers, loading, clearGeneratedMultivendorOffers: () => setGeneratedMultivendorOffers([]) };
};

export default useMultivendorOffer;
