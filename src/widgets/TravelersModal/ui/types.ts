import { type ReactNode } from 'react'
import { type PackageEntity } from '@entities/package'

export type TravelersModalProps = {
  closeModal: () => void
  onSuccess: (data: { adults: Traveler[]; children: Traveler[] }) => void
  packageDetails: PackageEntity
  travelers: {
    adults: Traveler[]
    children: Traveler[]
  }
  isOpen?: boolean
  onChange?: (data: Traveler[]) => void
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
