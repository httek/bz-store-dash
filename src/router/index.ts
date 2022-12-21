import {createRouter, createWebHistory, RouteRecord, RouteRecordRaw} from "vue-router";
import {useStore} from "../states/app.state";
import {Cache} from "../utils/cache";
import {TokenCacheKey} from "../consts/auth";
import {useAuthStore} from "../states/auth.state";

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Default.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: defaultRoutes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.token) {
    const token: string = Cache.get(TokenCacheKey)
    if (!token && !to.path.startsWith('/auth/login')) {
      return '/auth/login?redirect=' + from.path
    } else if (token && to.path.startsWith('/auth/login')) {
      return '/'
    }

    authStore.token = token
  }
})
export default router
