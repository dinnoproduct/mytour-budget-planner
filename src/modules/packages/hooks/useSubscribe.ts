import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isSubscribedAtom } from '../store/store.ts';
import { subscribeService } from '../services/PackagesServices.ts';

const useSubscribe = () => {
  const [isSubscribed, setIsSubscribed] = useRecoilState(isSubscribedAtom);
  const [loading, setLoading] = useState(false);

  const onSubscribe = (email: string) => {
    setLoading(true);
    void subscribeService(email)
      .then(({ data }) => {
        setIsSubscribed(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return { loading, isSubscribed, onSubscribe };
};

export default useSubscribe;
