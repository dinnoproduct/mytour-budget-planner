import { UserUseCases } from './UserUseCases.ts'
import { UserService } from './UserService.ts'

export const userUseCases = new UserUseCases({
	userService: new UserService(),
})

export type * from './types'