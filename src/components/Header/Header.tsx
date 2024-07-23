import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AppPaths } from '../../constants/constants.ts';
import './index.scss';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="inner-header">
      <div className="container flex space-between">
        <Link to={`/${AppPaths.packages}`}>
          <img className="logo-black" src="/images/logo_black.svg" alt="" />
        </Link>
        <Link to={`/${AppPaths.packages}`}>{t('packages')}</Link>
      </div>
    </div>
  );
};

export default Header;
