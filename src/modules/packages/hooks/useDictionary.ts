import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { dictionaryAtom } from '../store/store';
import { DictionaryTypes } from '../data/dictionaryEnum';
import { getDictionaryService } from '../services/PackagesServices';

const languageForDictionaryAdapter: Record<string, number> = {
  arm: 1,
  eng: 2,
  rus: 3,
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
