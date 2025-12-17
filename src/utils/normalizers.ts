import { PackagesFields } from '../modules/packages/data/packagesEnums.ts';
import { type TOptions } from '../modules/packages/data/packagesTypes.ts';

interface ISelectNormalizer {
  [PackagesFields.id]: number;
  [PackagesFields.nameArm]: string;
  [PackagesFields.nameEng]: string;
  [PackagesFields.nameRus]: string;
}

export const numberWithCommaNormalizer = (num: string | number = '', options?: { decimal?: boolean }) => {
  if (num == null || num === '' || num === '-' || num == 0) {
    return num;
  }

  return (options?.decimal ? parseFloat(num.toString()).toFixed(2) : num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const selectOptionNormalizer = (options: ISelectNormalizer[], language: string): TOptions =>
  options.map((option) => ({
    value: option[PackagesFields.id],
    label: option[
      `name${langKeyAdapter[language as keyof typeof langKeyAdapter]}` as keyof ISelectNormalizer
    ] as string,
  }));

export const langKeyAdapter = {
  arm: 'Arm',
  eng: 'Eng',
  rus: 'Rus',
  hy: 'Arm',
  en: 'Eng',
  ru: 'Rus',
};

export const dateFormatter = (date: Date | string) => {
  const validDate = date instanceof Date ? date : new Date(date);
  const year = validDate.getFullYear();
  const month = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const day = validDate.getDate().toString().padStart(2, '0');

  return date ? `${day}.${month}.${year}` : '';
};

const addLeadingZero = (value: number) => {
  if (value < 10) {
    return `0${value}`;
  }

  return `${value}`;
};

export const formatDateAndTime = (date: Date | string, options?: { onlyTime?: boolean; withTime?: boolean }) => {
  const validDate = date instanceof Date ? date : new Date(date);

  const year = validDate.getFullYear();
  const month = validDate.getMonth() + 1;
  const day = validDate.getDate();
  const hours = validDate.getHours();
  const minutes = validDate.getMinutes();
  const seconds = validDate.getSeconds();

  if (options?.onlyTime) {
    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
  }

  if (options?.withTime) {
    return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}T${addLeadingZero(hours)}:${addLeadingZero(
      minutes,
    )}:${addLeadingZero(seconds)}`;
  }

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};
