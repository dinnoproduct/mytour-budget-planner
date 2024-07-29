import { HeadingProps as ChakraHeadingProps, TextProps as ChakraTextProps } from '@chakra-ui/react'
import { ReactNode } from 'react'


export type TextFontSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
export type HeadingFontSizeType =  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
export type ColorType = 'light' | 'dark'

export type TextProps = {
  children: ReactNode | ReactNode[]
  size?: TextFontSizeType
  as?: 'p' | 'span' | 'div' | 'pre' | 'code' | 'blockquote'
  color?: ColorType
} & ChakraTextProps

export type HeadingProps = {
  children: ReactNode | ReactNode[]
  size?: HeadingFontSizeType
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: ColorType
} & ChakraHeadingProps
