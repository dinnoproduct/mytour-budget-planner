import { FlexProps } from '@chakra-ui/react'
import { IllustrationName } from '@components/Illustration'

export type EmptyStateProps = {
	illustrationName: IllustrationName
	children: string
} & FlexProps
