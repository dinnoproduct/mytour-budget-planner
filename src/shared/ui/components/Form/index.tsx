import React, { forwardRef, type Ref } from 'react'
import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormHelperText as ChakraFormHelperText
} from '@chakra-ui/react'
import {
  type FormLabelProps,
  type FormHelperTextProps,
  type FormControlProps,
  type FormControlType
} from './types'
import { HELPER_TEXT_COLOR_MAP } from './constants'

const FormControl: FormControlType = forwardRef(
  (
    { children, label, state, helperText, ...props }: FormControlProps,
    ref: Ref<any>
  ) => (
    <ChakraFormControl
      ref={ref}
      isDisabled={state === 'disabled'}
      isInvalid={state === 'invalid'}
      width="full"
      maxWidth="full"
      {...props}
    >
      {label ? <FormLabel>{label}</FormLabel> : null}

      {children}

      {helperText ? (
        <FormHelperText formState={state}>{helperText}</FormHelperText>
      ) : null}
    </ChakraFormControl>
  )
)

FormControl.displayName = 'FormControl'

const FormHelperText = ({
  formState = 'default',
  ...props
}: FormHelperTextProps) => (
  <ChakraFormHelperText
    color={HELPER_TEXT_COLOR_MAP[formState]}
    mt="2"
    fontSize="text-sm"
    lineHeight="text-sm"
    fontWeight="normal"
    align="start"
    px="0"
    mx="0"
    {...props}
  />
)

const FormLabel = (props: FormLabelProps) => (
  <ChakraFormLabel px="0" mx="0" {...props} />
)

export { FormControl, FormLabel, FormHelperText }

export type * from './types'
export { formComponentsTheme } from './theme'
