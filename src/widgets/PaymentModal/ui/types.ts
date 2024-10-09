import { ReactNode } from 'react'
import { PackageEntity } from '@entities/package'

export type PaymentModalProps = {
	closeModal: () => void
	onSuccess: (paymentAmount:number) => void
	onBackClick: () => void
	packageDetails: PackageEntity
	isOpen?: boolean
}

export type LayoutProps = {
	children: ReactNode
	isOpen: boolean
	closeModal: () => void
	title: string
	onBackClick?: () => void
}