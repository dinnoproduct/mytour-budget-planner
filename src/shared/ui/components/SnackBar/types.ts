import { type ToastProps } from '@chakra-ui/react'

export type EmitSnackBarProps = {
  status: 'success' | 'error'
  title: string
  props?: ToastProps['containerStyle']
}

// useToast

export type SnackBarProps = {
  title: string
  status: 'success' | 'error'
}
