import React, { forwardRef, LegacyRef } from 'react'
import { Img, ImgProps } from '@chakra-ui/react'
import LogoImage from './logos/logo.svg'
import SymbolImage from './logos/symbol.svg'

export type LogoProps = {
  type?: 'logo' | 'symbol'
} & ImgProps

export const Logo = forwardRef(
  (
    { type='logo', ...props }: LogoProps,
    ref: LegacyRef<HTMLImageElement>
  ) => (
    <Img
      ref={ref}
      src={type === 'logo' ? LogoImage : SymbolImage}
      alt="My Tour"
      height="40px"
      {...props}
    />
  )
)

Logo.displayName = 'Logo'
