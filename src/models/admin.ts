import {Role} from "./role";

export interface Admin {
[x: string]: any;
  id: number
  mobile: string
  name: string
  avatar?: string | null
  role?: Role | null
  token?: string | null
}
