import {defineStore} from "pinia";

export const useStore = defineStore('app', {
  state: () => ({routeLoading: false})
})
