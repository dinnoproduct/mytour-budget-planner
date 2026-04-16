import React, { forwardRef } from 'react'
import { Image, type ImageProps } from '@chakra-ui/next-js'
import LogoImage from './logos/logo.svg'
import SymbolImage from './logos/symbol.svg'

export type LogoProps = {
  type?: 'logo' | 'symbol'
} & Omit<ImageProps, 'src' | 'alt'>

export const Logo = forwardRef<HTMLImageElement, LogoProps>(
  ({ type = 'logo', ...props }, ref) => (
    <Image
      ref={ref}
      src={type === 'logo' ? LogoImage : SymbolImage}
      alt="My Tour"
      {...props}
    />
  )
)

Logo.displayName = 'Logo'
