import {createRouter, createWebHistory, RouteRecord, RouteRecordRaw} from "vue-router";
import {Cache} from "../utils/cache";
import {TokenCacheKey} from "../consts/auth";
import {useAuthStore} from "../states/auth.state";
import {profile} from "../apis/auth.api";
import {menus} from "../components/data/menus";
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

NProgress.configure({ easing: 'ease' });

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


const authRoutes: RouteRecordRaw[] = [
  {
    path: '/system/categories', component: () => import('../views/system/Category.vue'), meta: {
      title: '分类管理', auth: true
    }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes: [...defaultRoutes, ...authRoutes]
})

router.beforeEach(async (to, from) => {
  NProgress.start()
  const authStore = useAuthStore()
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
      authStore.profile = await profile()
    }

    if (token && !authStore.menus.length) {
      authStore.menus = menus
    }
  }

  // Has login status, guarded to auth login.
  else if (authStore.token && to.path.startsWith('/auth/login')) {
    return from.path
  }
})

router.afterEach((to) => {
  NProgress.done()
  const title = (to.meta['title'] as string) || import.meta.env.VITE_APP_NAME
  title && (document.title = title)
})

export default router
