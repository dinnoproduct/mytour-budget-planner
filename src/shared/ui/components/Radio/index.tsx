import React, {
  type ChangeEvent,
  forwardRef,
  type LegacyRef,
  type ReactNode
} from 'react'
import { Radio as ChakraRadio } from '@chakra-ui/react'

export type RadioProps = {
  isDisabled?: boolean
  isChecked?: boolean
  defaultChecked?: boolean
  isInvalid?: boolean
  name?: string
  value: string
  children?: ReactNode
  onChange?: (isChecked: boolean) => void

  [key: string]: any
}

export const Radio = forwardRef(
  (
    {
      children,
      isDisabled = false,
      isInvalid = false,
      onChange,
      name,
      value,
      isChecked = false,
      defaultChecked = false,
      ...props
    }: RadioProps,
    ref: LegacyRef<any>
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.checked)
    }

    return (
      <ChakraRadio
        ref={ref}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        onChange={handleChange}
        name={name}
        value={value}
        isChecked={isChecked}
        defaultChecked={defaultChecked}
        {...props}
      >
        {children}
      </ChakraRadio>
    )
  }
)

Radio.displayName = 'Radio'
