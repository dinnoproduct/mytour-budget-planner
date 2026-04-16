import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import './index.scss';

const BookAfterPaymentModal = () => {
  const { t } = useTranslation();
  const [isBookSuccessModalOpen, setBookSuccessModalOpen] = useState(false);
  const { searchParams, setSearchParams } = useQueryParams();

  useEffect(() => {
    if (searchParams.success === 'true' || searchParams.success === 'True') {
      setBookSuccessModalOpen(true);
    } else if (searchParams.success === 'false' || searchParams.success === 'False') {
      setBookSuccessModalOpen(true);
    }
  }, [searchParams.success]);

  const onClose = () => {
    setBookSuccessModalOpen(false);
    setSearchParams({});
  };

  return (
    <Modal isOpen={isBookSuccessModalOpen} ariaHideApp={false} onRequestClose={onClose}>
      {searchParams.error ? (
        <div>
          <div className="flex space-between m-b-16">
            <div className="modal-title font-bold">{t('pay')}</div>
            <button onClick={onClose}>
              <img src="/images/close.svg" alt="" />
            </button>
          </div>
          <div className="payment-success-wrapper text-center">
            <img src="/images/no_result.svg" alt="" />
            <div className="payment-success-text">{searchParams.error}</div>
            <div className="payment-success-footer text-right">
              <button className="btn-main" onClick={onClose}>
                {t('backToPackages')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex space-between m-b-16">
            <div className="modal-title font-bold">{t('pay')}</div>
            <button onClick={onClose}>
              <img src="/images/close.svg" alt="" />
            </button>
          </div>
          <div className="payment-success-wrapper text-center">
            <img src="/images/payment-success-icon.svg" alt="" />
            <div className="payment-success-text">{t('successDescription')}</div>
            <div className="payment-success-footer text-right">
              <button className="btn-main" onClick={onClose}>
                {t('backToPackages')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookAfterPaymentModal;
