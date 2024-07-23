import './index.scss';
import { useTranslation } from 'react-i18next';

const NoResult = () => {
  const { t } = useTranslation();

  return (
    <div className="no-result-wrapper text-center">
      <div className="no-result-image">
        <img src="/images/no_result.svg" alt="" />
      </div>
      <div className="no-result-text">{t('noResult')}</div>
    </div>
  );
};

export default NoResult;
