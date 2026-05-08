import { useState, useMemo } from 'react'
import { AuthModalProps, VerifyType, ViewType } from './types'
import { Layout } from './Layout'
import { SignUpView } from '@widgets/AuthModal/ui/SignUpView'
import { VerifyView } from '@widgets/AuthModal/ui/VerifyView'
import { SignInView } from '@widgets/AuthModal/ui/SignInView'
import { useTranslation } from 'react-i18next'
import { VIEW_CONTENT_MAP } from '@widgets/AuthModal/model'
import { SignInErrorView } from './SignInErrorView'
import { OTPErrorView } from '@widgets/AuthModal/ui/OTPErrorView'

export const AuthModal = ({ view, closeModal, onSuccess, isCloseOnSuccess = true }: AuthModalProps) => {
	const {t} = useTranslation()
	const [activeView, setActiveView] = useState<ViewType>(view)
	const [verifyType, setVerifyType] = useState<VerifyType>('signUp')
	const [payload, setPayload] = useState<any>(null)

	const ViewComponent = useMemo(() => {
		const ViewComponentMap = {
			signUp: () => <SignUpView
				onSuccess={(payload: any) => handleSuccess('signUp', payload)}
				onViewChange={handleViewChange}
				formData={payload?.formData || {}}
			/>,
			verify: () => <VerifyView
				type={verifyType}
				payload={payload}
				onSuccess={handleVerifySuccess}
				onViewChange={handleViewChange}
			/>,
			signIn: () => <SignInView
				onSuccess={(payload: any) => handleSuccess('signIn', payload)}
				onViewChange={handleViewChange}
				formData={payload?.formData || {}}
				isAlreadyRegistered={!!payload?.isAlreadyRegistered}
			/>,
			signInError: () => <SignInErrorView onViewChange={handleViewChange}/>,
			otpError: () => <OTPErrorView/>
		}
		return ViewComponentMap[activeView]
	}, [activeView, verifyType, payload])

	const handleBackClick = useMemo(() => {
		if (activeView === 'verify') {
			return () => setActiveView(verifyType)
		}

		return undefined
	}, [activeView, verifyType])

	const handleViewChange = (view: ViewType, payload?: any) => {
		setActiveView(view)
		if (payload) {
			setPayload(payload)
		}
	}

	const handleSuccess = (type: VerifyType, payload: any) => {
		setVerifyType(type)
		setPayload(payload)
		setActiveView('verify')
	}

	const handleVerifySuccess = () => {
		onSuccess?.()
		isCloseOnSuccess && closeModal()
	}

	return (
		<Layout
			title={t(VIEW_CONTENT_MAP[activeView].title)}
			isOpen={true}
			closeModal={closeModal}
			onBackClick={handleBackClick}
		>
			<ViewComponent/>
		</Layout>
	)
}