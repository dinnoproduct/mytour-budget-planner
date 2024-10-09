import {
	ConfirmLoginParams, ConfirmRegistrationParams, LoginParams, RegisterParams,
	ResendOtpParams,
	UserUseCaseParams

} from './types.ts'
import { UserService } from './UserService.ts'
import { AuthService } from './AuthService.ts'

export class UserUseCases {
	private readonly userService: UserService
	private readonly authService: AuthService

	constructor({ userService, authService }: UserUseCaseParams) {
		this.userService = userService
		this.authService = authService
	}

	getUser = async (token: string) => {
		return this.userService.getUser(token)
	}

	updateUser = async (token: string) => {
		return this.userService.updateUser(token)
	}

	register = async (data: RegisterParams) => {
		return this.authService.register(data)
	}

	confirmRegistration = async (data: ConfirmRegistrationParams) => {
		return this.authService.confirmRegistration(data)
	}

	login = async (data: LoginParams) => {
		return this.authService.login(data)
	}

	confirmLogin = async (data: ConfirmLoginParams) => {
		return this.authService.confirmLogin(data)
	}

	resendOTP = async (data: ResendOtpParams) => {
		return this.authService.resendOTP(data)
	}
}
