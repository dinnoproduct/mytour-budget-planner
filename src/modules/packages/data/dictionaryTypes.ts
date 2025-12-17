import { type DictionaryTypes } from './dictionaryEnum.ts';
import { type DictionaryFields } from './packagesEnums.ts';

export interface IDictionary {
  [DictionaryFields.key]: number;
  [DictionaryFields.value]: string;
}

export type TDictionary = Record<DictionaryTypes, IDictionary>;
