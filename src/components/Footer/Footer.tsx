import './index.scss';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="container">
        <div className="footer-wrapper flex">
          <div className="footer-item">
            <div className="flex space-between">
              <img className="footer-logo" src="/images/logo.svg" alt="" />
              <div className="social-mobile-block">
                <a href="https://ameriabank.am/" target="_blank" rel="noreferrer">
                  <img src="/images/facebook.svg" alt="" />
                </a>
                <a href="https://ameriabank.am/" target="_blank" rel="noreferrer">
                  <img src="/images/linkedin.svg" alt="" />
                </a>
                <a href="https://ameriabank.am/" target="_blank" rel="noreferrer">
                  <img src="/images/instagram.svg" alt="" />
                </a>
              </div>
              <div className="footer-contacts">
                <div className="p-b-4">info@mytour.am</div>
                <div>+374 93 24 07 32</div>
              </div>
            </div>
          </div>
          <div className="footer-item">
            <div className="flex space-between">
              <div className="footer-address">
                <div className="p-b-4">{t('dinno')}</div>
                <div className="footer-address-text">
                  {t('vazgenSargsyanAddress')} {t('yerevanAddress')}
                </div>
              </div>
              <div className="social-desktop-block">
                {/*<a href="https://ameriabank.am/" target="_blank" rel="noreferrer">*/}
                {/*  <img src="/images/facebook.svg" alt="" />*/}
                {/*</a>*/}
                {/*<a href="https://ameriabank.am/" target="_blank" rel="noreferrer">*/}
                {/*  <img src="/images/linkedin.svg" alt="" />*/}
                {/*</a>*/}
                <a
                  href="https://www.instagram.com/mytour.am?igsh=MXEwMHZuMGthYTlnYw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/instagram.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright text-center">© {new Date().getFullYear()} MyTour.</div>
      </div>
    </footer>
  );
};

export default Footer;
