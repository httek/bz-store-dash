import {defineStore} from "pinia";
import {Admin} from "../models/admin";
import {Menu} from "../models/menu";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string | null,
    profile: null as Admin | null,
    menus: [] as Menu[]
  })
})
