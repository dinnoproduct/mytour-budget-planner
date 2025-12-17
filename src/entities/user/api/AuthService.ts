import axios, { AxiosInstance } from 'axios'
import {
	ConfirmLoginParams,
	ConfirmRegistrationParams,
	LoginParams,
	RegisterParams,
	ResendOtpParams,
	UserEntity
} from '@entities/user'

export class AuthService {
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

  register(data: RegisterParams): Promise<UserEntity> {
    return this.api.post('/register', data)
  }

  confirmRegistration(data: ConfirmRegistrationParams): Promise<string> {
    return this.api.post('/confirmRegistration', data)
  }

  login(data: LoginParams): Promise<UserEntity> {
    return this.api.post('/login', data, {
	    headers: {
		    'Content-Type': 'application/json-patch+json'
	    }
    })
  }

  confirmLogin(data: ConfirmLoginParams): Promise<string> {
    return this.api.post('/confirmLogin', data)
  }

  resendOTP(data: ResendOtpParams): Promise<void> {
    return this.api.post('/resendOTP', data, {
	    headers: {
		    'Content-Type': 'application/json-patch+json'
	    }
    })
  }
}