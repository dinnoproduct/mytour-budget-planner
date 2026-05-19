import NextImage from 'next/image'
import { Box, type BoxProps } from '@chakra-ui/react'
import { type IllustrationProps } from '@components/Illustration/types'

export type * from './types'

export const Illustration = ({ name, ...props }: IllustrationProps & Omit<BoxProps, 'as'>) => {
  return (
    <Box
      position="relative"
      maxWidth="120px"
      maxHeight="120px"
      width="full"
      height="full"
      minHeight="120px"
      {...props}
    >
      <NextImage
        src={`/assets/illustrations/${name}.png`}
        alt={name}
        fill
        style={{ objectFit: 'contain' }}
        sizes="120px"
      />
    </Box>
  )
}
