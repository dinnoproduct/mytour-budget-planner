import { UserUseCases } from './UserUseCases.ts'
import { UserService } from './UserService.ts'
import { AuthService } from './AuthService.ts'


export const userUseCases = new UserUseCases({
	userService: new UserService(),
	authService: new AuthService(),
})

export type * from './types'