import { type FC } from 'react';
import './index.scss';

const Loader: FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <div className="loader">
        <div className="icon">
          <img src="/images/loader.svg" alt="" />
        </div>
        <div className="text">Loading...</div>
      </div>
    );
  }

  return null;
};

export default Loader;
