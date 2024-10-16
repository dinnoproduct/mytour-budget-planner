import { Layout } from './Layout.tsx'
import { PaymentModalProps, PaymentModalView } from '@widgets/PaymentModal/ui/types.ts'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { VIEW_CONTENT_MAP } from '@widgets/PaymentModal/model'
import { PaymentFormView } from '@widgets/PaymentModal/ui/PaymentFormView.tsx'
import { PaymentErrorView } from '@widgets/PaymentModal/ui/PaymentErrorView.tsx'

export const PaymentModal = ({
	                             closeModal,
	                             onSuccess,
	                             onBackClick,
	                             packageDetails,
	                             isOpen = false,
	                             view
                             }: PaymentModalProps) => {
	const { t } = useTranslation()
	const [activeView, setActiveView] = useState<PaymentModalView>(view || 'paymentForm')

	const ViewComponent = useMemo(() => {
		const ViewComponentMap = {
			paymentForm: () => <PaymentFormView
				onSuccess={onSuccess}
				packageDetails={packageDetails}
			/>,
			paymentError: () => <PaymentErrorView/>
		}

		return ViewComponentMap[activeView]
	}, [activeView])

	useEffect(() => {
		if (view) {
			setActiveView(view)
		}
	}, [view])

	const handleBackClick = useMemo(() => {
		if (activeView === 'paymentForm') {
			return () => onBackClick()
		}

		return undefined
	}, [activeView])


	return (
		<Layout
			title={t(VIEW_CONTENT_MAP[activeView].title)}
			isOpen={isOpen}
			closeModal={closeModal}
			onBackClick={handleBackClick}
		>
			<ViewComponent/>
		</Layout>
	)
}