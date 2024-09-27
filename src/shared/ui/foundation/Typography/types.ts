import { HeadingProps as ChakraHeadingProps, TextProps as ChakraTextProps } from '@chakra-ui/react'
import { ReactNode } from 'react'


export type TextFontSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
export type HeadingFontSizeType =
  'sm-xs' | 'sm-sm' | 'sm-md' | 'sm-lg' | 'sm-xl' | 'sm-2xl' | 'sm-3xl' | 'sm-4xl'
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export type TextProps = {
  children: ReactNode | ReactNode[]
  size?: TextFontSizeType | Record<string, TextFontSizeType>
  as?: 'p' | 'span' | 'div' | 'pre' | 'code' | 'blockquote'
  color?: string
} & ChakraTextProps

export type HeadingProps = {
  children: ReactNode | ReactNode[]
  size?: HeadingFontSizeType | Record<string, HeadingFontSizeType>
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: string
} & ChakraHeadingProps
