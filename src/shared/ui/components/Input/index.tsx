import React, {
  type ChangeEvent,
  forwardRef,
  type MouseEvent,
  type Ref,
  useMemo
} from 'react'
import {
  Input as ChakraInput,
  InputGroup,
  InputRightElement as ChakraInputRightElement,
  InputLeftElement as ChakraInputLeftElement
} from '@chakra-ui/react'
import { Icon } from '@foundation/Iconography'
import { FormControl } from '@components/Form'
import { type InputElementProps, type InputProps } from './types'
import { Text } from '@ui'
import { INPUT_COLOR_MAP } from './constants'

export const Input = forwardRef(
  (
    {
      value,
      onChange,
      type = 'text',
      placeholder,
      label,
      state = 'default',
      helperText,
      leftIconName,
      rightIconName,
      onRightIconClick,
      rightIconProps,
      onLeftIconClick,
      leftIconProps,
      containerProps = {},
      suffix,
      prefix,
      ...props
    }: InputProps,
    ref: Ref<any>
  ) => {
    const showInputRightElement = useMemo(
      () => rightIconName || suffix,
      [rightIconName, suffix]
    )
    const showInputLeftElement = useMemo(
      () => leftIconName || prefix,
      [leftIconName, prefix]
    )

    const inputPaddingRight = useMemo(() => {
      if (showInputRightElement) {
        let paddingRight = 20

        if (rightIconName) {
          paddingRight += 20
        }

        return `${paddingRight}px`
      }

      return undefined
    }, [showInputRightElement])

    const inputPaddingLeft = useMemo(() => {
      if (leftIconName) {
        let paddingLeft = 20

        if (leftIconName) {
          paddingLeft += 20
        }

        return `${paddingLeft}px`
      }

      return undefined
    }, [showInputLeftElement])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(event)
    }

    return (
      <FormControl
        label={label}
        helperText={helperText}
        state={state}
        {...containerProps}
      >
        <InputGroup>
          {showInputLeftElement && (
            <InputLeftElement
              iconName={leftIconName}
              onClick={onLeftIconClick}
              isDisabled={state === 'disabled'}
              {...leftIconProps}
            />
          )}

          <ChakraInput
            ref={ref}
            value={value}
            placeholder={placeholder}
            onChange={handleInputChange as any}
            type={type}
            pl={inputPaddingLeft}
            pr={inputPaddingRight}
            {...INPUT_COLOR_MAP[state]}
            {...props}
          />

          {showInputRightElement && (
            <InputRightElement
              iconName={rightIconName}
              onClick={onRightIconClick}
              isDisabled={state === 'disabled'}
              {...rightIconProps}
            />
          )}
        </InputGroup>
      </FormControl>
    )
  }
)

Input.displayName = 'Input'

const InputRightElement = ({
  iconName,
  onClick,
  content,
  isDisabled = false,
  ...props
}: InputElementProps) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return
    }

    event.stopPropagation()
    onClick && onClick(event)
  }

  return (
    <ChakraInputRightElement
      width="20px"
      right="12px"
      justifyContent="space-between"
      onClick={handleClick}
      top="unset"
      bottom="0"
      {...props}
    >
      {iconName ? (
        <Icon name={iconName} size="20" color="gray.500" />
      ) : (
        <Text size="sm" color="dark">
          {content}
        </Text>
      )}
    </ChakraInputRightElement>
  )
}

const InputLeftElement = ({
  isDisabled,
  onClick,
  iconName,
  content,
  ...props
}: InputElementProps) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return
    }

    event.stopPropagation()
    onClick && onClick(event)
  }

  return (
    <ChakraInputLeftElement
      width="20px"
      left="12px"
      justifyContent="space-between"
      onClick={handleClick}
      top="unset"
      bottom="0"
      {...props}
    >
      {iconName ? (
        <Icon name={iconName} size="20" color="gray.500" />
      ) : (
        <Text size="sm" color="dark">
          {content}
        </Text>
      )}
    </ChakraInputLeftElement>
  )
}

export { inputComponentTheme } from './theme'
