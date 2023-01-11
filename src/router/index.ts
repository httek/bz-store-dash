import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getAuthSession } from "../apis/auth.api";
import { TokenCacheKey } from "../consts/auth";
import { useStore } from "../states/app.state";
import { useAuthStore } from "../states/auth.state";
import { addRoute } from '../utils';
import { Cache } from "../utils/cache";

NProgress.configure({ easing: 'ease' });

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...defaultRoutes]
})

router.beforeEach(async (to, from) => {
  NProgress.start()
  const authStore = useAuthStore()
  const appStore = useStore()
  appStore.routeLoading = true
  // Lost state && token in cache.
  if (!authStore.token) {
    const token: string = Cache.get(TokenCacheKey)
    if (!token && !to.path.startsWith('/auth/login')) {
      return '/auth/login?redirect=' + from.path
    }

    // If token exists, guarded to auth login.
    else if (token && to.path.startsWith('/auth/login')) {
      return '/'
    }

    // Set token state
    authStore.token = token

    // Fetch profile for page refreshed.
    if (token && !authStore.profile) {
      const session = (await getAuthSession()).data
      authStore.profile = session.profile
      authStore.menus = session.menus
      authStore.menus.map(item => addRoute(router, item))

      return to.fullPath
    }

    // if (token && !authStore.menus.length) {
    //   authStore.menus = menus
    // }
  }

  // Has login status, guarded to auth login.
  else if (authStore.token && to.path.startsWith('/auth/login')) {
    return from.path
  }
})

router.afterEach((to) => {
  NProgress.done()
  const title = (to.meta['title'] as string)
  const company = import.meta.env.VITE_SITE_NAME
  document.title = title ? `${company} · ${title}` : company;
  const appStore = useStore()
  appStore.routeLoading = false
})

export default router
