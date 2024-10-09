import axios, { AxiosInstance } from 'axios'
import { UserEntity } from '@entities/user'

export class UserService {
	private readonly api: AxiosInstance

	constructor() {
		this.api = axios.create({
			baseURL: `${import.meta.env.VITE_API_URL}/user`
		})

		this.api.interceptors.response.use(
			response => response.data,
			error => Promise.reject(error)
		)
	}

	updateUser(token: string): Promise<UserEntity> {
		return this.api.post('', {}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	}

	getUser(token: string): Promise<UserEntity> {
		return this.api.get('getUser', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	}
}