import { ReactNode } from 'react'
import { PackageEntity } from '@entities/package'

export type PaymentSuccessModalProps = {
	closeModal: () => void
}

export type LayoutProps = {
	children: ReactNode
	isOpen: boolean
	closeModal: () => void
}