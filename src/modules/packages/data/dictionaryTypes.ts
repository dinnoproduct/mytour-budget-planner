import { type DictionaryTypes } from './dictionaryEnum';
import { type DictionaryFields } from './packagesEnums';

export interface IDictionary {
  [DictionaryFields.key]: number;
  [DictionaryFields.value]: string;
}

export type TDictionary = Record<DictionaryTypes, IDictionary>;
