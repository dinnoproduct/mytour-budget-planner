import axios, { AxiosInstance } from 'axios'
import { GenerateOffersInput, OfferEntity, PackageEntity, SearchPackagesParams } from '@entities/package'

export class PackageService {
	private readonly apiVersion = 'V2'
	private readonly api: AxiosInstance

	constructor() {
		this.api = axios.create({
			baseURL: `${import.meta.env.VITE_API_URL}/package/`
		})

		this.api.interceptors.response.use(
			response => response.data,
			error => Promise.reject(error)
		)
	}

	async getPackageList(): Promise<PackageEntity[]> {
		return this.api(`/${this.apiVersion}/getPackages`)
	}

	async searchPackages(search: SearchPackagesParams): Promise<PackageEntity[]> {
		return this.api.post('searchPackages', search)
	}

	async getPackage(offerId: number): Promise<PackageEntity> {
		return this.api(`/getPackage/?id=${offerId}`)
	}

	async generateOffers(input: GenerateOffersInput): Promise<OfferEntity[]> {
		return this.api.post('generateOffers', input)
	}
}