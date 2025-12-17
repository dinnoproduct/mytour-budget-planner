import { useTranslation } from 'react-i18next';
import { useController, useFormContext } from 'react-hook-form';
import { type FC, type InputHTMLAttributes } from 'react';
import './index.scss';
import classnames from 'classnames';

interface MCheckbox extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
  customOnChange?: (checked: boolean) => void;
}

const MCheckbox: FC<MCheckbox> = ({ name, label, className, customOnChange, ...props }) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const {
    field: { onChange, ref, value, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const handleChange = () => {
    customOnChange?.(!value);
    onChange(!value);
  };

  return (
    <div className={classnames('checkbox-wrapper cursor', className)} onClick={handleChange}>
      <input {...props} type="checkbox" checked={value} />
      {label}
    </div>
  );
};

export default MCheckbox;
