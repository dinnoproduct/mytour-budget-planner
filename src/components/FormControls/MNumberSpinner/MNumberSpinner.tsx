import { useTranslation } from 'react-i18next';
import { useController, useFormContext } from 'react-hook-form';
import { type FC } from 'react';
import './index.scss';

interface MCheckbox {
  name: string;
  minimumNumber: number;
  handleChange?: (value: number, type: string) => void;
}

const MNumberSpinner: FC<MCheckbox> = ({ name, minimumNumber, handleChange }) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const {
    field: { onChange, ref, value, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const changeHandler = (type: string) => () => {
    const minus = type === 'minus';

    if (value === minimumNumber && minus) {
      return;
    }

    const newValue: number = minus ? value - 1 : value + 1;

    onChange(newValue);
    handleChange?.(newValue, type);
  };

  return (
    <div className="number-spinner-wrapper flex">
      <div className="number-spinner cursor flex" onClick={changeHandler('minus')}>
        <img
          src={value === minimumNumber ? '/images/spinner_minus_disabled.svg' : '/images/spinner_minus.svg'}
          alt=""
        />
      </div>
      <div className="spinner-value">{value}</div>
      <div className="number-spinner cursor flex" onClick={changeHandler('plus')}>
        <img src="/images/spinner_plus.svg" alt="" />
      </div>
    </div>
  );
};

export default MNumberSpinner;
