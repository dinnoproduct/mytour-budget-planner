import { type FC, memo, type ReactElement, useRef, useState } from 'react';

import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { formatDateAndTime } from '../../../utils/normalizers.ts';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';
import classnames from 'classnames';
import { useRecoilValue } from 'recoil';
import { screenBreakpointAtom } from '../../../modules/packages/store/store.ts';

interface IMDatePicker {
  name: string;
  placeholderText?: string;
  label?: string | ReactElement;
  viewMode?: boolean;
  minDate?: Date;
  maxDate?: Date;
  includeDates?: Date[];
  datePickerMenuToLeft?: boolean;
  datePickerMenuToRight?: boolean;
  handleChange?: (date: string) => void;
}

const MDatePicker: FC<IMDatePicker> = ({
  name,
  placeholderText,
  handleChange,
  label,
  datePickerMenuToLeft,
  datePickerMenuToRight,
  ...rest
}) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const [tempDate, setTempDate] = useState('');

  const datePickerRef = useRef<DatePicker>(null);

  const breakpoint = useRecoilValue(screenBreakpointAtom);

  const {
    field: { onChange, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const onClose = () => {
    datePickerRef?.current?.setOpen(false);
  };

  const onSave = () => {
    onClose();

    if (!tempDate) {
      return;
    }

    onChange(tempDate ? tempDate : '');
    handleChange?.(tempDate);
  };

  return (
    <div
      className={classnames({
        // TODO fix styling of opened datepicker menu
        'menu-to-left': datePickerMenuToLeft,
        'menu-to-right': datePickerMenuToRight,
        'react-datepicker-error': error?.message,
      })}
    >
      <div className="datepicker-label">{label}</div>
      <DatePicker
        {...restField}
        {...rest}
        ref={datePickerRef}
        onChange={(date: Date) => {
          // void form?.trigger?.(name);
        }}
        onBlur={() => {
          void form?.trigger?.(name);
        }}
        onSelect={(date: Date) => {
          setTempDate(date ? formatDateAndTime(date, { withTime: true }) : '');
        }}
        shouldCloseOnSelect={false}
        selected={restField?.value && new Date(restField.value as string)}
        value={restField?.value && new Date(restField.value as string)}
        dateFormat="dd / MM / YYYY"
        placeholderText={placeholderText}
        yearDropdownItemNumber={70}
        onFocus={(e) => {
          if (breakpoint !== 'large') {
            e.target.readOnly = true;
            e.target.blur();
          }
        }}
        showYearDropdown
        showMonthDropdown
        scrollableYearDropdown
        // locale="hy"
      >
        <div className="datepicker-footer">
          <button className="btn-outline" onClick={onClose} type="button">
            {t('close')}
          </button>
          <button className="btn-main m-l-12" onClick={onSave} type="button">
            {t('save')}
          </button>
        </div>
      </DatePicker>
      <div className="error-message">{error?.message}</div>
    </div>
  );
};

export default memo(MDatePicker);
