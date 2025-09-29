import { useTranslation } from 'react-i18next';
import { LanguageLink } from '../LanguageLink/LanguageLink';
import { AppPaths } from '../../constants/constants.ts';
import './index.scss';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="inner-header">
      <div className="container flex space-between">
        <LanguageLink to={`/${AppPaths.packages}`}>
          <img className="logo-black" src="/images/logo_black.svg" alt="" />
        </LanguageLink>
        <LanguageLink to={`/${AppPaths.packages}`}>{t('packages')}</LanguageLink>
      </div>
    </div>
  );
};

export default Header;
