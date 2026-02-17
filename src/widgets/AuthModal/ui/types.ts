import { FormEvent, ReactNode } from 'react'
import { StackProps } from '@chakra-ui/react'

export type AuthModalProps = {
	closeModal: () => void
	onSuccess: () => void
	view: ViewType
	isCloseOnSuccess?: boolean
}

export type ViewType = 'signIn' | 'signUp' | 'verify' | 'signInError' | 'otpError'
export type VerifyType = ViewType
export type LayoutVariant = 'modal' | 'page'

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
	layoutVariant?: LayoutVariant
	isDisabled?: boolean
}

export type SignUpViewProps = {
	onSuccess: (payload?: any) => void
	onViewChange?: (view: 'signIn' | 'verify', payload?: any) => void
	layoutVariant?: LayoutVariant
	formData?: {
		firstname: string
		lastname: string
		email: string
		phoneNumber: string
	}
}

export type SignInViewProps = {
	onSuccess: (payload?: any) => void
	onViewChange?: (view: 'signUp' | 'verify' | 'signInError', payload?: any) => void,
	layoutVariant?: LayoutVariant
	formData?: {
		phoneNumber: string
	},
	isAlreadyRegistered?: boolean
}

export type SignInErrorViewProps = {
	onViewChange?: (view: 'signUp') => void,
	layoutVariant?: LayoutVariant
}

export type VerifyViewProps = {
	type: VerifyType
	onSuccess: () => void
	payload: any
	onViewChange?: (view: 'otpError') => void
	layoutVariant?: LayoutVariant
}