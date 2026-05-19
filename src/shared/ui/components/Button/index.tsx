import React, { useMemo, forwardRef, type Ref } from 'react'
import { Button as ChakraButton, Box } from '@chakra-ui/react'
import { Icon } from '@foundation/Iconography'
import { ICON_BUTTON_SIZE_MAP, ICON_SIZE_MAP } from './constants'
import { type ButtonProps, type ButtonSize, type LinkProps } from './types'
import NextLink from 'next/link'

export const Button = forwardRef(
  (
    {
      children,
      variant = 'solid-blue',
      size = 'md',
      href,
      isDisabled = false,
      iconAfter,
      iconBefore,
      icon,
      isFillIconColor = false,
      to,
      isLoading = false,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      ...props
    }: ButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    const linkProps = useMemo<LinkProps | {}>(() => {
      if (href) {
        return {
          href,
          as: 'a'
        }
      } else if (to) {
        return {
          as: NextLink,
          href: to,
        }
      }

      return {}
    }, [href])

    const buttonSize = useMemo(
      () => (variant.startsWith('link') ? `${size}Link` : size),
      [size, variant]
    )

    if (icon) {
      return (
        <ChakraButton
          ref={ref}
          aria-label={iconBefore}
          isDisabled={isDisabled}
          variant={`${variant}-icon`}
          size={`${size}-icon`}
          isLoading={isLoading}
          {...props}
        >
          <Icon
            name={icon}
            size={ICON_BUTTON_SIZE_MAP[size as ButtonSize]}
            mr="0"
          />
        </ChakraButton>
      )
    }

    return (
      <ChakraButton
        ref={ref}
        isDisabled={isDisabled}
        isLoading={isLoading}
        variant={isFillIconColor ? `${variant}-icon` : variant}
        size={buttonSize}
        {...(iconBefore && {
          leftIcon: (
            <Icon name={iconBefore} size={ICON_SIZE_MAP[size as ButtonSize]} />
          )
        })}
        {...(iconAfter && {
          rightIcon: (
            <Icon name={iconAfter} size={ICON_SIZE_MAP[size as ButtonSize]} />
          )
        })}
        {...linkProps}
        {...props}
      >
        <Box
          as="span"
          className="button__label"
          display={isLoading ? 'none' : 'inline'}
        >
          {children}
        </Box>
      </ChakraButton>
    )
  }
)
Button.displayName = 'Button'

export { buttonComponentTheme } from './theme'
export type * from './types'
