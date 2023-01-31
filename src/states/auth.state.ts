import { defineStore } from "pinia";
import { Admin } from "../models/admin";
import { Menu } from "../models/menu";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string | null,
    profile: null as Admin | null,
    menus: [] as Menu[],
    permissions: [] as string[]
  }),
  actions: {
    hasPermission(slug: string): boolean {
      return true;

      if (this.profile?.type == 0) {
        return true
      }

      return this.permissions.includes(slug)
    }
  }
})
