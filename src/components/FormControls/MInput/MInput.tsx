import { useTranslation } from 'react-i18next';
import './index.scss';
import { useController, useFormContext } from 'react-hook-form';
import { type ChangeEvent, type FC, type InputHTMLAttributes, type ReactNode } from 'react';
import classnames from 'classnames';

interface IMInput extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  isDisabled?: boolean;
  label?: string;
  regexp?: RegExp;
}

const MInput: FC<IMInput> = ({ name, placeholder, label, regexp, ...props }) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const {
    field: { onChange, ref, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (regexp) {
      if (event.target.value.match(regexp) || !event.target.value) {
        void onChange(event);
      }
    } else {
      void onChange(event);
    }
  };

  return (
    <div className="input-wrapper">
      <div className="input-label">{label}</div>
      <input
        {...props}
        className={classnames('input', { 'with-error': error?.message })}
        placeholder={placeholder}
        {...restField}
        onChange={handleChange}
      />
      <div className="error-message">{error?.message as ReactNode}</div>
    </div>
  );
};

export default MInput;
