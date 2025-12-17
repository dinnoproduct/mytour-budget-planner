import { FlexProps } from '@chakra-ui/react'
import { IllustrationName } from '@components/Illustration'
import { ButtonProps } from '@components/Button'

export type EmptyStateProps = {
	illustrationName: IllustrationName
	text: string
	buttonLabel?: string
	buttonProps?: ButtonProps
} & Omit<FlexProps, 'children'>
