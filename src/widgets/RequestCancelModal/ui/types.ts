import { type ReactNode } from 'react'

export type RequestCancelModalProps = {
  closeModal: () => void
  requestId: number
  onSuccess?: () => void
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
}
