import Slider, { type LazyLoadTypes } from 'react-slick';
import { useRef, useState } from 'react';
import { PackagesFields } from '../../modules/packages/data/packagesEnums';
import { useTranslation } from 'react-i18next';

import './index.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { preventParentSlideAtom, screenBreakpointAtom } from '../../modules/packages/store/store';
import classnames from 'classnames';

interface IImageSlider {
  images: { [PackagesFields.url]: string; [PackagesFields.size]: number }[];
  isBest?: boolean;
  isPackageList?: boolean;
}

const slideTime = 300;

const ImageSlider = ({ images, isBest, isPackageList }: IImageSlider) => {
  const sliderRef = useRef<Slider>(null);
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const breakpoint = useRecoilValue(screenBreakpointAtom);

  const [preventParentSlide, setPreventParentSlide] = useRecoilState(preventParentSlideAtom);

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: false,
    speed: slideTime,
    lazyLoad: 'ondemand' as LazyLoadTypes,
    beforeChange: (current: number, next: number) => setTimeout(() => setCurrentSlide(next), slideTime),
    arrows: true,
  };

  const sliderImages = images?.filter((image) => {
    if (isPackageList) {
      return image?.[PackagesFields.size] === 1;
    } else return image?.[PackagesFields.size] === 3;
  });

  return (
    <div
      className="best-offer-top-slider"
      // onMouseDownCapture={(event) => {
      //   setPreventParentSlide(true);
      // }}
      // onMouseUpCapture={() => {
      //   setPreventParentSlide(false);
      // }}
      onPointerDownCapture={() => {
        setPreventParentSlide(true);
      }}
      onPointerUpCapture={() => {
        setPreventParentSlide(false);
      }}
    >
      <div className="slider-image-wrapper position-relative">
        <Slider
          ref={sliderRef}
          {...settings}
          className={classnames({
            'hide-prev': currentSlide === 0 || breakpoint === 'small',
            'hide-next': currentSlide + 1 === images?.length || breakpoint === 'small',
          })}
        >
          {sliderImages?.map(({ url }) => (
            <div className="image background" key={url}>
              <div className="image-inner w-100 h-100" style={{ backgroundImage: `url(${url})` }}>
                {isBest && <div className="tip position-absolute text-center">{t('bestOffer')}</div>}
              </div>
            </div>
          ))}
        </Slider>
        <div className="images-count">
          {currentSlide + 1}/{sliderImages?.length}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
