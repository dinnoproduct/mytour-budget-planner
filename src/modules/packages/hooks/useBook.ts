import { useState } from 'react';
import { bookPackageService } from '../services/PackagesServices.ts';
import { type IBookRequest } from '../data/packagesTypes.ts';
import { useRecoilState } from 'recoil';
import { userTokenAtom } from '../store/store.ts';

const useBook = () => {
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useRecoilState(userTokenAtom);

  const bookPackage = (data: IBookRequest) => {
    setLoading(true);
    void bookPackageService(data, userToken)
      .then(({ data }) => {
        window.location.href = data.bookingPaymentUrl;
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return { loading, bookPackage };
};

export default useBook;
