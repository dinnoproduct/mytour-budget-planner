"use client"

import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  const { t } = useTranslation();
  const types = {
    info: {
      icon: 'alertInfo',
    },
    success: {
      icon: 'alertSuccess',
    },
    warning: {
      icon: 'alertWarning',
    },
    error: {
      icon: 'alertError',
    },
  };

  const [rightPosition, setRightPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(0);

  useEffect(() => {
    const updateRightPosition = () => {
      const deviceWidth = window.innerWidth;
      const rightSpaceWidth = deviceWidth > 1170 ? (deviceWidth - 1170) / 2 : deviceWidth < 1024 ? 16 : 32;
      const topSpaceWidth = deviceWidth > 1170 ? 118 : 90;
      setRightPosition(rightSpaceWidth);
      setTopPosition(topSpaceWidth);
    };

    updateRightPosition();
    window.addEventListener('resize', updateRightPosition);

    return () => {
      window.removeEventListener('resize', updateRightPosition);
    };
  }, []);

  return (
    <div>
      <ToastContainer
        style={{ top: topPosition, right: rightPosition }}
        closeButton={({ closeToast }) => (
          <div className="flex items-center pointer" onClick={closeToast}>
            <span className="close">{t('close')}</span>
          </div>
        )}
      />
    </div>
  );
};

export default Toaster;
