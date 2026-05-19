import useCities from '../../hooks/useCities';
import CheckboxMultiSelect from '../CheckboxMultiSelect/CheckboxMultiSelect';
import { memo, useEffect, useMemo, useState } from 'react';
import { selectOptionNormalizer } from '../../../../utils/normalizers';
import { useTranslation } from 'react-i18next';
import { type TOption } from '../../data/packagesTypes';
import FilterInput from '../FilterInput/FilterInput';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { filteredPackagesAtom, packagesAtom, packagesCurrentPageAtom } from '../../store/store';
import { PackagesFields } from '../../data/packagesEnums';

import { useQueryParams } from '../../../../hooks/useQueryParams';
import './index.scss';

const singleParams = ['search'];

const Filters = () => {
  const [selectedOptions, setSelectedOptions] = useState<TOption[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const setFilteredPackages = useSetRecoilState(filteredPackagesAtom);
  const setCurrentPage = useSetRecoilState(packagesCurrentPageAtom);

  const packages = useRecoilValue(packagesAtom);

  const { searchParams, setSearchParams } = useQueryParams();

  const { i18n } = useTranslation();

  const { cities } = useCities();

  const options = useMemo(() => selectOptionNormalizer(cities, i18n.language), [cities, i18n.language]);

  const onSearch = () => {
    if (searchInput || selectedOptions.length) {
      const searchQuery: Partial<{ search: string; cities: string[] }> = {};
      selectedOptions.length && (searchQuery.cities = selectedOptions.map((item) => item.value.toString()));
      searchInput && (searchQuery.search = searchInput);
      setSearchParams(searchQuery);
    } else {
      setSearchParams({});
    }

    setCurrentPage(1);
  };

  const onFilter = () => {
    const searchInput = (searchParams.search || '')?.toString();
    const filteredPackages = packages
      .filter((tourPackage) =>
        selectedCities.length
          ? selectedCities.some(
              (selectedOption) => selectedOption.value === tourPackage[PackagesFields.city][PackagesFields.id],
            )
          : true,
      )
      .filter(
        (tourPackage) =>
          tourPackage[PackagesFields.nameArm].toLowerCase().includes(searchInput.toLowerCase()) ||
          tourPackage[PackagesFields.nameEng].toLowerCase().includes(searchInput.toLowerCase()) ||
          tourPackage[PackagesFields.nameRus].toLowerCase().includes(searchInput.toLowerCase()),
      );
    setFilteredPackages(filteredPackages);
  };

  const selectedCities = useMemo(() => {
    const searchParamCity = Array.isArray(searchParams.cities) ? searchParams.cities : [searchParams.cities];
    const filteredCities = cities.filter((city) =>
      searchParamCity.some((selectedCity) => selectedCity === city[PackagesFields.id].toString()),
    );

    return selectOptionNormalizer(filteredCities, i18n.language);
  }, [cities, i18n.language, searchParams.cities]);

  useEffect(() => {
    if (searchParams?.cities?.length) {
      setSelectedOptions(selectedCities);
    }

    setSearchInput((searchParams.search as string) || '');
  }, [selectedCities, searchParams.search, searchParams.cities]);

  useEffect(() => {
    onFilter();
  }, [packages, searchParams.search, selectedCities]);

  return (
    <div className="container">
      <div className="filter-wrapper flex">
        <CheckboxMultiSelect options={options} selectedOptions={selectedOptions} onChange={setSelectedOptions} />
        <FilterInput value={searchInput} onChange={setSearchInput} onSearch={onSearch} />
      </div>
    </div>
  );
};

export default memo(Filters);
