import { type ReactNode } from 'react'
import { type PackageEntity } from '@entities/package'

export type TravelersModalProps = {
  closeModal: () => void
  onSuccess: (data: Travelers) => void
  packageDetails: PackageEntity
  travelers: Travelers
  isOpen?: boolean
  onChange?: (data: Travelers) => void
}

export type Travelers = {
  adults: Traveler[]
  children: Traveler[]
}

export type VerifyType = 'signIn' | 'signUp'

export type LayoutProps = {
  children: ReactNode
  isOpen: boolean
  closeModal: () => void
  title: string
}

export type Traveler = {
  firstName: string
  lastName: string
  dateOfBirth: string
}

export type FormData = {
  adults: Traveler[]
  children: Traveler[]
}
