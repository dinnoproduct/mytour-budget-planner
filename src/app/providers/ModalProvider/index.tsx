import { useDisclosure } from '@chakra-ui/react'
import { EmptyObject } from 'global'
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer
} from 'react'
import {
	ModalContext as ModalContentType,
	ModalProviderProps,
	ModalReducerAction,
	IModalReducerState,
	modalReducerType,
	ModalTypes
} from './types'
import { AuthModal } from '@widgets/AuthModal'
import { TravelersModal } from '@widgets/TravelersModal'
import { PaymentModal } from '@widgets/PaymentModal'
import { PaymentSuccessModal } from '@entities/package'

const modals = {
	auth: AuthModal,
	travelers: TravelersModal,
	payment: PaymentModal,
	paymentSuccess: PaymentSuccessModal
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
	const [state, dispatch] = useReducer(
		modalReducer(modals) as modalReducerType,
		initialState
	)

	const { isOpen, onOpen, onClose } = useDisclosure()
	const closeModal = (callbackOptions?: any) => {
		state.onClose(callbackOptions)
		onClose()
		dispatch({ type: 'close' })
	}

	useEffect(() => {
		if (state.activeModal && state.type === 'open') {
			onOpen()
		} else if (state.type === 'close') {
			closeModal()
		}
	}, [state.activeModal, state.type])

	const ActiveModal = state.activeModal

	return (
		<ModalContext.Provider
			value={{ modalState: state, dispatchModal: dispatch }}>
			{ActiveModal && (
				// @ts-ignore
				<ActiveModal isOpen={isOpen} closeModal={closeModal} {...state.props} />
			)}

			{children}
		</ModalContext.Provider>
	)
}

const initialState: IModalReducerState = {
	modalType: null,
	type: 'close',
	props: {},
	attributes: {},
	activeModal: undefined,
	onClose: () => {
	}
}

export const ModalContext = createContext<ModalContentType>({
	modalState: initialState,
	dispatchModal: () => {
	}
})

export const useModalContext = () => useContext(ModalContext)

const modalReducer =
	(modals: ModalTypes | EmptyObject) =>
		(state: IModalReducerState, action: ModalReducerAction) => {
			switch (action.type) {
				case 'open': {
					if (action.modalType && modals[action.modalType]) {
						return {
							...state,
							activeModal: modals[action.modalType],
							props: action.props || {},
							attributes: action.attributes || {},
							modalType: action.modalType,
							type: 'open',
							onClose: action.onClose || (() => {
							})
						}
					}
					console.error('modal not found')
					return state
				}
				case 'update': {
					return {
						...state,
						props: {
							...state.props,
							...action.props
						},
						attributes: {
							...state.attributes,
							...action.attributes
						},
						// here null will always use the previous onClose
						onClose: action.onClose ?? state.onClose
					}
				}
				case 'close': {
					state.onClose()
					return initialState
				}
				default:
					console.error('modal action not found')
			}
		}
