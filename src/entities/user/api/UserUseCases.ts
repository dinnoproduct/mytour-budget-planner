import {
  type ConfirmLoginParams,
  type ConfirmRegistrationParams,
  type LoginParams,
  type RegisterParams,
  type ResendOtpParams,
  type UpdateUserInput,
  type UserUseCaseParams
} from './types.ts'
import { type UserService } from './UserService.ts'
import { type AuthService } from './AuthService.ts'

export class UserUseCases {
  private readonly userService: UserService
  private readonly authService: AuthService

  constructor({ userService, authService }: UserUseCaseParams) {
    this.userService = userService
    this.authService = authService
  }

  getUser = async (token: string) => this.userService.getUser(token)

  updateUser = async (token: string, input: UpdateUserInput) =>
    this.userService.updateUser(token, input)

  register = async (data: RegisterParams) => this.authService.register(data)

  confirmRegistration = async (data: ConfirmRegistrationParams) =>
    this.authService.confirmRegistration(data)

  login = async (data: LoginParams) => this.authService.login(data)

  confirmLogin = async (data: ConfirmLoginParams) =>
    this.authService.confirmLogin(data)

  resendOTP = async (data: ResendOtpParams) => this.authService.resendOTP(data)
}
