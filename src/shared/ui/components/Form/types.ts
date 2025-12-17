import {
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react'
import {
  FormLabelProps as ChakraFormLabelProps,
  FormControlProps as ChakraFormControlProps,
  FormHelperTextProps as ChakraFormHelperTextProps
} from '@chakra-ui/react'

export type FormControlProps = {
  children: ReactNode | ReactNode[]
  state: FormState
  helperText?: string
  label?: string
} & ChakraFormControlProps

export type FormState = 'default' | 'invalid' | 'validated' | 'disabled' | 'warning'

export type FormControlType = ForwardRefExoticComponent<
  FormControlProps & RefAttributes<HTMLDivElement>
>

export type FormLabelProps = ChakraFormLabelProps

export type FormHelperTextProps = {
  formState?: FormState
} & ChakraFormHelperTextProps

