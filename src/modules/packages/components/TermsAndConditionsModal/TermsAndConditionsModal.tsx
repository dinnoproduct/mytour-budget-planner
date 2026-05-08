import Modal from 'react-modal';
import { type FC } from 'react';
import usePolicy from '../../hooks/usePolicy';
import { TermsAndConditionTypes } from '../../data/dictionaryEnum';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store';

interface ITermsAndConditionsModal {
  termsAndConditionType: TermsAndConditionTypes;
  onClose: () => void;
  title: string;
}

const TermsAndConditionsModal: FC<ITermsAndConditionsModal> = ({ termsAndConditionType, onClose, title }) => {
  const { parsedPolicy, cancelationPolicy } = usePolicy();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  return (
    <Modal isOpen={!!termsAndConditionType} ariaHideApp={false} onRequestClose={onClose}>
      <div className="flex space-between m-b-16">
        <div className="modal-title font-bold">{title}</div>
        <button onClick={onClose}>
          <img src="/images/close.svg" alt="" />
        </button>
      </div>
      <div className="payment-rules">
        <div className="payment-rules-text">
          {termsAndConditionType === TermsAndConditionTypes.bookTerms ? (
            <>
              {parsedPolicy.before}{' '}
              <a href={parsedPolicy.url} target="_blank" rel="noreferrer" className="policy-url">
                {parsedPolicy.urlText}
              </a>
              {parsedPolicy.after}
            </>
          ) : (
            packageDetails[cancelationPolicy]
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TermsAndConditionsModal;
