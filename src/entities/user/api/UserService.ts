import axios, { type AxiosInstance } from 'axios'
import { type UpdateUserInput, type UserEntity } from '@entities/user'

export class UserService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  updateUser(token: string, input: UpdateUserInput): Promise<boolean> {
    return this.api.post('updateUserInfo', input, {
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
