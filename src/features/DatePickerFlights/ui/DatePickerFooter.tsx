import { DatePickerFooterProps } from './types.ts'
import React, { useMemo } from 'react'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { Flex } from '@chakra-ui/react'

export const DatePickerFooter = ({
	                                 onConfirm,
	                                 isConfirmDisabled,
	                                 fromDate,
	                                 toDate
                                 }: DatePickerFooterProps) => {
	const { t } = useTranslation()

	const nights = useMemo(() => {
		if (!fromDate || !toDate) return 0
		const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1
	}, [fromDate, toDate])


	return (
		<Flex
			textAlign="right"
			height="80px"
			width="full"
			align="center"
			px="8"
			justify="flex-end"
			borderTop="1px solid"
			borderColor="gray.100"
			position={{ base: 'fixed', md: 'static' }}
			bottom={{ base: 0, md: undefined }}
			bgColor="white"
		>
			<Button
				onClick={onConfirm}
				variant="solid-blue"
				width="full"
        size='lg'
				isDisabled={isConfirmDisabled}
			>
				{t`confirm`} ({nights} {t`night`})
			</Button>
		</Flex>
	)
}
