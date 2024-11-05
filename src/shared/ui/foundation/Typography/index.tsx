import React, { forwardRef, type Ref } from 'react'
import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react'
import { type TextProps, type HeadingProps } from './types'

export const Text = forwardRef(
  (
    { children, size = 'md', as = 'p', color, ...props }: TextProps,
    ref: Ref<HTMLElement>
  ) => {
    const variant =
      typeof size === 'string'
        ? `text-${size}`
        : Object.fromEntries(
          Object.entries(size).map(([key, value]) => [key, `text-${value}`])
        )

    return (
      <ChakraText
        ref={ref as any}
        as={as}
        variant={variant}
        color={color}
        {...props}
      >
        {children}
      </ChakraText>
    )
  }
)
Text.displayName = 'Text'

export const Heading = forwardRef(
  (
    {
      children,
      fontWeight,
      size = 'md',
      as = 'h2',
      color,
      ...props
    }: HeadingProps,
    ref: Ref<any>
  ) => {
    const variant =
      typeof size === 'string'
        ? `heading-${size}`
        : Object.fromEntries(
          Object.entries(size).map(([key, value]) => [
            key,
            `heading-${value}`
          ])
        )

    return (
      <ChakraHeading
        ref={ref}
        as={as}
        variant={variant}
        color={color}
        {...props}
      >
        {children}
      </ChakraHeading>
    )
  }
)
Heading.displayName = 'Heading'

export { typographyTheme, typographyComponentTheme } from './theme'
