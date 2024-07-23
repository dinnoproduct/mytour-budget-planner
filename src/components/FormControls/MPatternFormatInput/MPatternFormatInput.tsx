import { useController, useFormContext } from 'react-hook-form';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

import '../MInput/index.scss';
import { type FC } from 'react';
import classnames from 'classnames';

interface IMPatternFormatInput {
  name: string;
  label: string;
  customOnChange?: (value: string) => void;
  format?: string;
  disabled?: boolean;
  numericFormat?: boolean;
  decimalScale?: number;
}

const MPatternFormatInput: FC<IMPatternFormatInput> = ({
  name,
  label,
  customOnChange,
  format = '',
  numericFormat,
  decimalScale = 0,
  ...props
}) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const {
    field: { onChange, ref, ...restField },
    fieldState: { error },
  } = useController({ control: form.control, name });

  if (numericFormat) {
    return (
      <div className="input-wrapper">
        <div className="input-label">{t(label)}</div>
        <NumericFormat
          {...props}
          {...restField}
          value={restField.value}
          onValueChange={(values) => {
            onChange(values.value);
            customOnChange?.(values.value);
          }}
          valueIsNumericString={true}
          className={classnames('input', { 'with-error': error?.message })}
          thousandSeparator=","
          decimalScale={decimalScale}
        />
        <div className="error-message">{error?.message}</div>
      </div>
    );
  }

  return (
    <div className="input-wrapper">
      <div className="input-label">{t(label)}</div>
      <PatternFormat
        {...props}
        {...restField}
        format={format}
        value={restField.value}
        onValueChange={(values) => {
          onChange(values.value);
          customOnChange?.(values.value);
        }}
        valueIsNumericString={true}
        className={classnames('input', { 'with-error': error?.message })}
        allowEmptyFormatting
      />
      <div className="error-message">{error?.message}</div>
    </div>
  );
};

export default MPatternFormatInput;
