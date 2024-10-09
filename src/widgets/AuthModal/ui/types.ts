import { FormEvent, ReactNode } from 'react'
import { StackProps } from '@chakra-ui/react'

export type AuthModalProps = {
	closeModal: () => void
	onSuccess: () => void
	view: ViewType
	isCloseOnSuccess?: boolean
}

export type ViewType = 'signIn' | 'signUp' | 'verify'
export type VerifyType = ViewType

export type LayoutProps = {
	children: ReactNode
	isOpen: boolean
	closeModal: () => void
	title: string
	onBackClick?: () => void
}

export type ContentLayoutProps = {
	children: ReactNode | ReactNode[]
	primaryButtonLabel: string
	secondaryButtonLabel?: string
	onSecondaryButtonClick?: () => void
	contentContainerProps?: StackProps
	onSubmit?: (e: FormEvent<HTMLDivElement>) => void
	isLoading?: boolean
}

export type SignUpViewProps = {
	onSuccess: (payload?: any) => void
	onViewChange?: (view: 'signIn' | 'verify') => void
	formData?: {
		firstname: string
		lastname: string
		email: string
		phoneNumber: string
	}
}

export type SignInViewProps = {
	onSuccess: (payload?: any) => void
	onViewChange?: (view: 'signUp' | 'verify') => void,
	formData?: {
		phoneNumber: string
	}
}

export type VerifyViewProps = {
	type: VerifyType
	onSuccess: () => void
	payload: any
}