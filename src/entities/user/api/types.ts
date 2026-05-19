import { type UserService } from './UserService'
import { type AuthService } from './AuthService'

export type UserUseCaseParams = {
  userService: UserService
  authService: AuthService
}

export type RegisterParams = {
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
}

export type ConfirmRegistrationParams = {
  userId: number
  otp: string
}

export type LoginParams = {
  phoneNumber: string
}

export type ConfirmLoginParams = {
  phoneNumber: string
  otp: string
}

export type ResendOtpParams = {
  phoneNumber: string
}

export type UpdateUserInput = {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
}
