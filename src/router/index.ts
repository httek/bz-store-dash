import { createRouter, createWebHistory, RouteRecord, RouteRecordRaw } from "vue-router";
import { Cache } from "../utils/cache";
import { TokenCacheKey } from "../consts/auth";
import { useAuthStore } from "../states/auth.state";
import { getAuthProfile } from "../apis/auth.api";
import { menus } from "../components/data/menus";
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { useStore } from "../states/app.state";

NProgress.configure({ easing: 'ease' });

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Dash.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/brands', component: () => import(`../views/Brand.vue`), meta: {
      title: '品牌', auth: true
    }
  },
  {
    path: '/categories', component: () => import(`../views/Category.vue`), meta: {
      title: '分类', auth: true
    }
  },
  {
    path: '/stores', component: () => import((`../views/Store.vue`)), meta: {
      title: '店铺', auth: true
    }
  },
  {
    path: '/delivery', component: () => import('../views/Delivery.vue'), meta: {
      title: '配送', auth: true
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
      authStore.profile = (await getAuthProfile()).data
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
  const title = (to.meta['title'] as string)
  const company = import.meta.env.VITE_SITE_NAME
  document.title = title ? `${company} · ${title}` : company;
  const appStore = useStore()
  appStore.routeLoading = false
})

export default router
