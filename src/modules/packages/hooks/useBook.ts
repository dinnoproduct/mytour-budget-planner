import { useState } from 'react';
import { bookPackageService } from '../services/PackagesServices';
import { type IBookRequest } from '../data/packagesTypes';
import { useRecoilState } from 'recoil';
import { userTokenAtom } from '../store/store';

const useBook = () => {
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useRecoilState(userTokenAtom);

  const bookPackage = (data: IBookRequest) => {
    setLoading(true);
    bookPackageService(data, userToken)
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
