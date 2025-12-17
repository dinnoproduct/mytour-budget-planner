import { useToast } from '@chakra-ui/react'
import { SnackBar } from './index'
import { type EmitSnackBarProps } from '@components/SnackBar/types.ts'

const useSnackBar = () => {
  const toast = useToast()

  const emitSnackBar = ({ status, title, props = {} }: EmitSnackBarProps) => {
    toast({
      position: 'top',
      render: () => <SnackBar title={title} status={status} />,
      duration: 3000,
      isClosable: false,
      containerStyle: {
        width: 'full',
        maxWidth: '400px',
        ...props
      }
    })
  }

  const closeAllSnackBars = () => {
    toast.closeAll()
  }

  return {
    emitSnackBar,
    closeAllSnackBars
  }
}

export { useSnackBar }
