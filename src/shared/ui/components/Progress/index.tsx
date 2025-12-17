import { ProgressProps } from './types'
import {
	Progress as ChakraProgress,
} from '@chakra-ui/react'
import React from 'react'

export const Progress = ({ ...props }: ProgressProps) => {
	return (
		<ChakraProgress
			width="full"
			{...props}
		/>
	)
}


