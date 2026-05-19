import { useRecoilValue } from 'recoil';
import { dictionaryAtom } from '../store/store';
import { type DictionaryTypes } from '../data/dictionaryEnum';
import { useMemo } from 'react';
import { DictionaryFields } from '../data/packagesEnums';

const useDictionaryByKey = (key: number, dictionaryType: DictionaryTypes) => {
  const dictionary = useRecoilValue(dictionaryAtom(dictionaryType));

  return useMemo(
    () => dictionary.find((item) => item[DictionaryFields.key] === key)?.[DictionaryFields.value] || '',
    [dictionary, key],
  );
};

export default useDictionaryByKey;
