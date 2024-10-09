import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { useUser } from '../hooks'
import { UserEntity } from '@entities/user'

interface UserContextType {
	userToken: string;
	setUserToken: (token: string) => void;
	user?: UserEntity
	clearUserData: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: {children: ReactNode}) => {
	const [token, setToken] = React.useState<string>(localStorage.getItem('userToken') || '')

	const setUserToken = (token: string) => {
		localStorage.setItem('userToken', token)
		setToken(token)
	}

	const { data: user } = useUser(token, {
		enabled: !!token
	})

	const clearUserData = () => {
		localStorage.removeItem('userToken')
		setToken('')
	}

	return (
		<UserContext.Provider
			value={{ userToken: token, setUserToken, user, clearUserData }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUserContext = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider')
	}
	return context
}