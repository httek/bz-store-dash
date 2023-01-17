import { Role } from "./role";

export interface Admin {
  id?: number
  type?: number
  mobile?: string
  name?: string
  password?: string
  avatar?: string | null
  role_id?: number
  role?: Role | null
  token?: string | null,
  status?: number,
  created_at?: string
  updated_at?: string
}
