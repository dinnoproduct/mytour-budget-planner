import { ImgProps } from '@chakra-ui/react'

export type IllustrationProps = {
	name: IllustrationName
} & ImgProps

export type IllustrationName = 'error' | 'loading' | 'no-connection' | 'no-result' | 'otp' | 'success'