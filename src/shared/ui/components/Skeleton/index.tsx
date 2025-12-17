import { SkeletonProps, SkeletonTextProps } from './types'
import {
	Skeleton as ChakraSkeleton,
	SkeletonCircle as ChakraSkeletonCircle,
	SkeletonText as ChakraSkeletonText
} from '@chakra-ui/react'
import React from 'react'

export const Skeleton = ({ ...props }: SkeletonProps) => {
	return (
		<ChakraSkeleton
			{...props}
		/>
	)
}

export const SkeletonCircle = ({ ...props }: SkeletonProps) => {
	return (
		<ChakraSkeletonCircle
			{...props}
		/>
	)
}

export const SkeletonText = ({ ...props }: SkeletonTextProps) => {
	return (
		<ChakraSkeletonText
			{...props}
		/>
	)
}


