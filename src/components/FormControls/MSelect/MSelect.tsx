import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useController, useFormContext } from 'react-hook-form';
import Select, { type SingleValue, type DropdownIndicatorProps, type GroupBase } from 'react-select';
import { type TOption } from '../../../modules/packages/data/packagesTypes.ts';
import './index.scss';
import classnames from 'classnames';

interface IMSelect<T> {
  name: string;
  options: T[];
  isDisabled?: boolean;
  label?: string;
  classNames?: Record<string, string>;
}

const MSelect = <T,>({ name, options, isDisabled, label, classNames = {} }: IMSelect<T>) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const {
    field: { onChange, ref, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const onChangeHandler = (value: SingleValue<TOption>) => {
    onChange(value);
  };

  return (
    <div className="select-wrapper">
      <div className={classnames('select-label', { disabled: { isDisabled } })}>{label}</div>
      <Select
        components={{
          DropdownIndicator,
        }}
        // @ts-ignore
        options={options}
        // @ts-ignore
        onChange={onChangeHandler}
        isDisabled={isDisabled}
        classNames={{
          container: () => 'modal-select-container',
          control: () => classnames('modal-select-control', { 'select-error': error?.message }),
          indicatorSeparator: () => 'modal-select-indicator-separator',
          valueContainer: () => 'modal-value-container',
          menu: () => 'modal-select-menu',
          menuList: () => 'modal-select-menu-list',
          ...classNames,
        }}
        {...restField}
      />
      <div className="error-message">{error?.message}</div>
    </div>
  );
};

const DropdownIndicator = ({
  selectProps: { menuIsOpen },
}: DropdownIndicatorProps<TOption, boolean, GroupBase<TOption>>): ReactElement => (
  <div>{menuIsOpen ? <img src="/images/icon_up.svg" alt="" /> : <img src="/images/icon_down.svg" alt="" />}</div>
);

export default MSelect;
