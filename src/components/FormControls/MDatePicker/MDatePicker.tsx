import { type FC, memo, type ReactElement, useRef, useState } from 'react'

import { useController, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { formatDateAndTime } from '../../../utils/normalizers.ts'
import 'react-datepicker/dist/react-datepicker.css'
import './index.scss'
import classnames from 'classnames'
import { useRecoilValue } from 'recoil'
import { screenBreakpointAtom } from '../../../modules/packages/store/store.ts'
import { Box } from '@chakra-ui/react'
import { Button } from '@ui'
import { FormLabel } from '@components/Form'

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
	const { t } = useTranslation()
	const form = useFormContext()
	const [tempDate, setTempDate] = useState('')
	const datePickerRef = useRef<DatePicker>(null)
	const breakpoint = useRecoilValue(screenBreakpointAtom)

	const {
		field: { onChange, value, ref, ...restField },
		fieldState: { error },
	} = useController({
		name,
		control: form.control,
		rules: { required: t('requiredField') },
		defaultValue: '',
	});

	const onClose = () => {
		datePickerRef?.current?.setOpen(false)
	}

	const onSave = () => {
		onClose()
		if (!tempDate) return

		onChange(tempDate)
		handleChange?.(tempDate)
	}

	return (
		<Box
			className={classnames({
				'menu-to-left': datePickerMenuToLeft,
				'menu-to-right': datePickerMenuToRight,
				'react-datepicker-error': error?.message
			})}
		>
			<FormLabel>{label}</FormLabel>

			<DatePicker
				{...restField}
				{...rest}
				autoComplete='off'
				ref={datePickerRef}
				onChange={(date: Date) => {
					const formattedDate = date ? formatDateAndTime(date, { withTime: true }) : ''
					setTempDate(formattedDate)
					onChange(formattedDate)
					form.clearErrors(name) // Clear error when a valid date is set
				}}
				selected={value ? new Date(value) : null}
				dateFormat="dd / MM / YYYY"
				popperPlacement={breakpoint === 'large' ? 'bottom-end' : 'bottom'}
				placeholderText={placeholderText}
				yearDropdownItemNumber={70}
				onFocus={(e) => {
					if (breakpoint !== 'large') {
						e.target.readOnly = true
						e.target.blur()
					}
				}}
				showYearDropdown
				showMonthDropdown
				scrollableYearDropdown
			>
				<Box className="datepicker-footer">
					<Button size="md" onClick={onClose} type="button" variant="text-blue" px="0">
						{t('close')}
					</Button>

					<Button size="md" onClick={onSave} type="button" ml="6" px="4">
						{t('confirm')}
					</Button>
				</Box>
			</DatePicker>

			<Box className="error-message">{error?.message}</Box>
		</Box>
	)
}

export default memo(MDatePicker)
