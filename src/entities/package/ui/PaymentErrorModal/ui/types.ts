import { type ReactNode } from 'react'

export type PaymentErrorModalProps = {
  closeModal: () => void
}

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
}
