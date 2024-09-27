import axios, { AxiosInstance } from 'axios'
import { BookPackageInput, BookPackageResponse, DictionaryEntity, DictionaryTypes } from '@entities/package'

export class DictionaryService {
	private readonly api: AxiosInstance

	constructor() {
		this.api = axios.create({
			baseURL: `${import.meta.env.VITE_API_URL}/common`
		})

		this.api.interceptors.response.use(
			response => response.data,
			error => Promise.reject(error)
		)
	}

	getDictionary(
		dictionaryType: DictionaryTypes,
		language: number
	): Promise<DictionaryEntity[]> {
		return this.api(`get${dictionaryType}`, {
			params: {
				language
			}
		})
	}
}