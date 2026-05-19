"use client";

import React, { createContext, useContext, type ReactNode } from 'react'
import { useSetUser, useUser } from '../hooks'
import { type UserEntity } from '@entities/user'

interface UserContextType {
  userToken: string
  setUserToken: (token: string) => void
  user?: UserEntity
  isLoading: boolean
  signOut: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useSetUser()
  const [token, setToken] = React.useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('userToken') || '' : ''
  )

  const setUserToken = (token: string) => {
    localStorage.setItem('userToken', token)
    setToken(token)
  }

  const { data: user, isLoading: isLoadingUser } = useUser(token, {
    enabled: !!token
  })

  const signOut = () => {
    localStorage.removeItem('userToken')
    setToken('')
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        userToken: token,
        setUserToken,
        user,
        isLoading: isLoadingUser,
        signOut
      }}
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
