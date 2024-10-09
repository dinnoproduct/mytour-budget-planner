import { AnyObject } from 'global'
import { Dispatch, ReactNode, Reducer, ComponentType } from 'react'

export type ModalType =
	| 'auth'
  | 'travelers'
  | 'payment'
  | 'paymentSuccess'

export type modalReducerType = Reducer<
	IModalReducerState,
	Partial<IModalReducerState>
>

export interface IModalReducerState {
	modalType: ModalType | null
	type: ModalActionType
	props: AnyObject
	attributes: AnyObject
	activeModal: ReactNode
	onClose: (options?: any) => void
}

export type ModalActionType = 'open' | 'close' | 'update'

export type ModalReducerAction = Partial<IModalReducerState>

export type ModalTypes = {
	[key in ModalType]: ComponentType<any>
}

export interface ModalProviderProps {
	children?: ReactNode
}

export type ModalContext = {
	modalState: IModalReducerState
	dispatchModal: Dispatch<Partial<IModalReducerState>>
}
