import {
	UserUseCaseParams

} from './types.ts'
import { UserService } from './UserService.ts'

export class UserUseCases {
	private readonly userService: UserService

	constructor({ userService }: UserUseCaseParams) {
		this.userService = userService
	}

	async updateUser(token: string) {
		return this.userService.updateUser(token)
	}
}