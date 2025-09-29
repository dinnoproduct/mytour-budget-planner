import { type ChangeEvent, type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IFilterInput {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const FilterInput: FC<IFilterInput> = ({ value, onChange, onSearch }) => {
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="search-inp position-relative">
      <input value={value} onChange={handleChange} placeholder={t('searchPackagesByHotel')} />
      <button onClick={onSearch} className="position-absolute primary-button search_home">
        {t('search')}
      </button>
    </div>
  );
};

export default FilterInput;
