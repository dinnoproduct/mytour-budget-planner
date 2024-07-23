import { useState } from 'react';
import { updateUserService } from '../services/PackagesServices.ts';
import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../store/store.ts';

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  const updateUser = (token: string, onSuccess: () => void) => {
    setLoading(true);
    void updateUserService(token)
      .then(({ data }) => {
        setUserInfo(data);
        onSuccess?.();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { updateUser, loading };
};

export default useUser;
