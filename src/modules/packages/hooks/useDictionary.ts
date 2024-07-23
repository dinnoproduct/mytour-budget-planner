import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { dictionaryAtom } from '../store/store.ts';
import { DictionaryTypes } from '../data/dictionaryEnum.ts';
import { getDictionaryService } from '../services/PackagesServices.ts';

const languageForDictionaryAdapter: Record<string, number> = {
  hy: 1,
  en: 2,
  ru: 3,
};

const useDictionary = (dictionaryType: DictionaryTypes) => {
  const { i18n } = useTranslation();

  const [dictionary, setDictionary] = useRecoilState(dictionaryAtom(DictionaryTypes[dictionaryType]));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    void getDictionaryService(languageForDictionaryAdapter[i18n.language], dictionaryType)
      .then(({ data }) => {
        setDictionary(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [i18n.language, dictionaryType]);

  return { dictionary, loading };
};

export default useDictionary;
