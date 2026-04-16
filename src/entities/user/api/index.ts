import { UserUseCases } from './UserUseCases'
import { UserService } from './UserService'
import { AuthService } from './AuthService'


export const userUseCases = new UserUseCases({
	userService: new UserService(),
	authService: new AuthService(),
})

export type * from './types'