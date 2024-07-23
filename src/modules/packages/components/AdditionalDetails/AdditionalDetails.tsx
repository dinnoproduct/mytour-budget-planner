import { useState } from 'react';

import './index.scss';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { packageDetailsAtom } from '../../store/store.ts';
import { langKeyAdapter } from '../../../../utils/normalizers.ts';
import { DictionaryFields, PackagesFields } from '../../data/packagesEnums.ts';
import useDictionary from '../../hooks/useDictionary.ts';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';

const facilityIconMapping = {
  1: 'shape',
  2: 'water_park',
  4: 'water_sport_equepment',
  8: 'evening_program',
  16: 'childrens_club',
  32: 'game_room',
  64: 'garden',
  128: 'spa',
  256: 'non_smoking_rooms',
  512: 'front_line',
  1024: 'private_beach',
  2048: 'beach_chairs',
  4096: 'family_room',
  8192: 'childrens_playground',
  16384: 'gym',
};

const AdditionalDetails = () => {
  const { t, i18n } = useTranslation();
  const packageDetails = useRecoilValue(packageDetailsAtom);

  const [textVisible, setTextVisible] = useState(false);

  const { dictionary: facilityDictionary } = useDictionary(DictionaryTypes.FacilityDictionary);

  const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter;
  const description = `description${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.descriptionArm;

  return (
    <div>
      <div className="additional-items">
        {facilityDictionary.map((facility) => {
          if (packageDetails[PackagesFields.hotel]?.[PackagesFields.facilities] & facility[DictionaryFields.key]) {
            return (
              <div className="additional-item flex" key={facility[DictionaryFields.key]}>
                <img
                  src={`/images/${facilityIconMapping[facility[DictionaryFields.key] as keyof typeof facilityIconMapping]}.svg`}
                  alt=""
                />
                <span>{facility[DictionaryFields.value]}</span>
              </div>
            );
          } else return null;
        })}
      </div>
      <div className={`additional-texts ${!textVisible ? 'additional-text-invisible' : 'additional-text-visible'}`}>
        <div className="additional-text">{packageDetails[PackagesFields.hotel]?.[description]}</div>
        {/*<div className="additional-text">*/}
        {/*  Բոլոր սենյակները ունեն հեռուստացույց արբանյակային ալիքներով, սառնարան, թեյնիկ, ցնցուղ, անվճար լոգանքի*/}
        {/*  պարագաներ և զգեստապահարան: Մոտակա օդանավակայանը Հուրգադայի միջազգային օդանավակայանն է՝ հյուրանոցից 2,5 կմ*/}
        {/*  հեռավորության վրա:*/}
        {/*</div>*/}
      </div>
      <button className="read_more" onClick={() => setTextVisible(!textVisible)}>
        {!textVisible ? t('readMore') : t('close')}
      </button>
    </div>
  );
};

export default AdditionalDetails;
