import { useState, useMemo } from 'react'
import { AuthModalProps, VerifyType, ViewType } from './types.ts'
import { Layout } from './Layout.tsx'
import { SignUpView } from '@widgets/AuthModal/ui/SignUpView.tsx'
import { VerifyView } from '@widgets/AuthModal/ui/VerifyView.tsx'
import { SignInView } from '@widgets/AuthModal/ui/SignInView.tsx'
import { useTranslation } from 'react-i18next'
import { VIEW_CONTENT_MAP } from '@widgets/AuthModal/model'

export const AuthModal = ({ view, closeModal, onSuccess, isCloseOnSuccess = true }: AuthModalProps) => {
	const {t} = useTranslation()
	const [activeView, setActiveView] = useState<ViewType>(view)
	const [verifyType, setVerifyType] = useState<VerifyType>('signUp')
	const [payload, setPayload] = useState<any>(null)

	const ViewComponent = useMemo(() => {
		const ViewComponentMap = {
			signUp: () => <SignUpView
				onSuccess={(payload: any) => handleSuccess('signUp', payload)}
				onViewChange={setActiveView}
				formData={payload?.formData || {}}
			/>,
			verify: () => <VerifyView type={verifyType} payload={payload} onSuccess={handleVerifySuccess}/>,
			signIn: () => <SignInView
				onSuccess={(payload: any) => handleSuccess('signIn', payload)}
				onViewChange={setActiveView}
				formData={payload?.formData || {}}
			/>
		}
		return ViewComponentMap[activeView]
	}, [activeView, verifyType])

	const handleBackClick = useMemo(() => {
		if (activeView === 'verify') {
			return () => setActiveView(verifyType)
		}

		return undefined
	}, [activeView, verifyType])

	const handleSuccess = (type: VerifyType, payload: any) => {
		setVerifyType(type)
		setPayload(payload)
		setActiveView('verify')
	}

	const handleVerifySuccess = () => {
		onSuccess()
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