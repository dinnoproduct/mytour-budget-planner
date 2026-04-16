import { type Dispatch, type ReactElement, type SetStateAction } from 'react';
import Select, { type DropdownIndicatorProps, type GroupBase, type OptionProps } from 'react-select';
import { type TOption } from '../../data/packagesTypes';
import { useTranslation } from 'react-i18next';

import './index.scss';

interface ICheckboxMultiSelect {
  options: TOption[];
  selectedOptions: TOption[];
  onChange: Dispatch<SetStateAction<TOption[]>>;
}

const CheckboxMultiSelect = ({ options, selectedOptions, onChange }: ICheckboxMultiSelect) => {
  const { t } = useTranslation();

  const handleChange = (selectedOption: TOption, isSelected: boolean) => {
    if (isSelected) {
      onChange((prevState) => prevState.filter((item) => item.value !== selectedOption.value));
    } else {
      onChange((prevState) => [...prevState, selectedOption]);
    }
  };

  return (
    <Select
      options={options}
      value={selectedOptions}
      // @ts-ignore
      onChange={handleChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isClearable={false}
      components={{
        Option: OptionCheckbox,
        MultiValue: SelectedValue,
        DropdownIndicator,
      }}
      classNames={{
        container: () => 'select-container',
        control: (props) => `select-control ${props.selectProps.menuIsOpen ? 'select-menu-open-container' : ''}`,
        indicatorSeparator: () => 'select-indicator-separator',
        valueContainer: () => 'value-container',
        menu: () => 'select-menu',
        menuList: () => 'select-menu-list',
      }}
      placeholder={t('choseCity')}
      // menuIsOpen={true}
      isMulti
    />
  );
};

const SelectedValue = ({ data }: { data: TOption }) => <div className="m-r-4">{data.label}</div>;

const OptionCheckbox = ({ data, isSelected, selectProps: { onChange }, children }: OptionProps<TOption, true>) => (
  <div
    className="option-checkbox flex cursor"
    onClick={() => {
      // @ts-ignore
      onChange(data, isSelected);
    }}
  >
    <input type="checkbox" checked={isSelected} />
    <label className="pointer">{children}</label>
  </div>
);

const DropdownIndicator = ({
  selectProps: { menuIsOpen },
}: DropdownIndicatorProps<TOption, boolean, GroupBase<TOption>>): ReactElement => (
  <div>{menuIsOpen ? <img src="/images/arrow-up.svg" alt="" /> : <img src="/images/arrow-down.svg" alt="" />}</div>
);

export default CheckboxMultiSelect;
