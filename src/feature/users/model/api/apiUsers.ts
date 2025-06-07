import { api } from '@/shared/api'
import type { ResUser } from '@/feature/users/model/types'

const USERS = '/users'

export const apiUsers = {
  async getUsers(id: number) {
    const res = await api.get<ResUser>(`${USERS}/${id}`)
    return res.data
  },
}
