import axios, { AxiosInstance } from 'axios'
import { BookPackageInput, BookPackageResponse } from '@entities/package'

export class RequestService {
	private readonly api: AxiosInstance

	constructor() {
		this.api = axios.create({
			baseURL: `${import.meta.env.VITE_API_URL}/request`
		})

		this.api.interceptors.response.use(
			response => response.data,
			error => Promise.reject(error)
		)
	}

	bookPackage(input: BookPackageInput, token: string): Promise<BookPackageResponse> {
		return this.api.post('book', input, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	}
}