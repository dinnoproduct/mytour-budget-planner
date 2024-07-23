import { type SetStateAction, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './index.scss';
import Offer from '../Offer/Offer.tsx';
import { useRecoilValue } from 'recoil';
import { packagesAtom, preventParentSlideAtom, screenBreakpointAtom } from '../../store/store.ts';
import { useTranslation } from 'react-i18next';
import { PackagesFields } from '../../data/packagesEnums.ts';
import { useNavigate } from 'react-router-dom';
import { type IPackage } from '../../data/packagesTypes.ts';
import useDragDetection from '../../../../hooks/useDragDetection.ts';

const PackageSlider = () => {
  const { t } = useTranslation();
  const packages = useRecoilValue(packagesAtom);
  const sliderRef = useRef<Slider>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const screenSize = useRecoilValue(screenBreakpointAtom);
  const disableSwipe = useRecoilValue(preventParentSlideAtom);

  const bestOffers = useMemo(() => packages.slice(0, 5), [packages]);

  const settings = {
    dots: false,
    infinite: false,
    swipeToSlide: !disableSwipe,
    swipe: !disableSwipe,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1170,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
    afterChange: (currentSlide: SetStateAction<number>) => {
      setSlideIndex(currentSlide);
    },
  };

  const onPrev = () => {
    sliderRef?.current?.slickPrev();
  };

  const onNext = () => {
    sliderRef?.current?.slickNext();
  };

  const targetIndex =
    screenSize === 'large'
      ? bestOffers.length - 3
      : screenSize === 'medium'
        ? bestOffers.length - 2
        : screenSize === 'small'
          ? bestOffers.length - 1.2
          : undefined;

  const isDisabled = slideIndex === targetIndex;

  const navigate = useNavigate();

  const { handleMouseDown, dragging } = useDragDetection();

  // @ts-ignore
  const handleChildClick = (e: MouseEvent<HTMLDivElement, MouseEvent>, tourPackage: IPackage): void => {
    if (dragging) {
      e.preventDefault();
    } else {
      navigate(`${tourPackage[PackagesFields.offerId]}`);
    }
  };

  return (
    <div className="best-offers-wrapper home-slider-wrapper">
      <div className="container">
        <div className="title font-bold text-center">{t('bestOffer')}</div>
        <div className="best-offer-slider-wrapper position-relative">
          <Slider {...settings} ref={sliderRef}>
            {packages.slice(0, 5).map((tourPackage) => (
              <div className="home-slider-inner" key={tourPackage.offerId} onMouseDownCapture={handleMouseDown}>
                <Offer tourPackage={tourPackage} isBest handleCardClick={handleChildClick} />
              </div>
            ))}
          </Slider>
          <span className={`main-slider-arr arr-left ${slideIndex === 0 ? 'disabled' : ''}`} onClick={onPrev}></span>
          <span className={`main-slider-arr arr-right ${isDisabled ? 'disabled' : ''}`} onClick={onNext}></span>
        </div>
      </div>
    </div>
  );
};

export default PackageSlider;
