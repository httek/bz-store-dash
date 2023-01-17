<template>
  <transition name="el-fade-in-linear">
    <el-container v-if="authStore.token" v-show="authStore.profile" :class="['h-screen']" class="p-0">
      <el-header class="header bg-slate-900 text-white overflow-hidden p-0"
        :style="{ height: `${Layout.HeaderHeight}px` }">
        <div class="flex h-full justify-center content-center">
          <div class="flex-shrink-0 pl-6 h-full py-3" :style="{ width: `${Layout.AsideMaxWidth}px` }">
            <RouterLink to="/">
              <el-image style="height: 32px" fit="contain"
                src="https://angular.io/assets/images/logos/angular/logo-nav@2x.png"></el-image>
            </RouterLink>
          </div>
          <div class="flex-1 h-full justify-center items-center content-center pr-4 pt-4 text-right"
            :style="{ width: `${Layout.AsideMaxWidth}px` }">
            <el-popover v-if="authStore.profile" :width="200" placement="bottom-end">
              <template #reference>
                <el-badge is-dot class="mt-2">
                  <el-icon size="18">
                    <MessageBox />
                  </el-icon>
                </el-badge>
              </template>
              <template #default>
                <el-empty :image-size="60" />
              </template>
            </el-popover>

            <el-dropdown v-if="authStore.profile" class="ml-7">
              <el-avatar fit="contain" style="height: 28px; width: 28px;"
                :src="authStore.profile?.avatar || 'https://fs.assets.icraft.ltd/illustrations/3d-illustration-person-with-sunglasses_23-2149436188.webp'">
                {{ authStore.profile.name }}
              </el-avatar>
              <template #dropdown>
                <el-dropdown-menu style="width: 120px;">
                  <el-dropdown-item>
                    <el-icon>
                      <User />
                    </el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon>
                      <Lock />
                    </el-icon> 安全设置
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon>
                      <Document />
                    </el-icon> 操作日志
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="onLogout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container :style="{ height: `calc(100vh - ${Layout.HeaderHeight}px)` }" class="p-0">
        <el-aside class="aside h-full bg-white" :style="{ width: `${Layout.AsideMaxWidth}px` }">
          <el-scrollbar>
            <Sidebar class="" :active="MenuActive" :menus="authStore.menus" :is-collapse="LeftCollapsed" />
          </el-scrollbar>
        </el-aside>
        <el-main class="p-0 overflow-x-hidden border-0 bg-slate-400 bg-opacity-5">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
    <!-- Auth -->
    <el-container v-else class="h-screen">
      <el-aside class="auth-aside aside" width="280px"></el-aside>
      <el-main class="h-full p-0">
        <RouterView />
      </el-main>
    </el-container>
  </transition>
</template>

<style scoped>
.aside {
  transition: all .3s;
  box-shadow: 0 2px 8px 0 rgb(7 12 20 / 12%);
  z-index: 99;
}

.auth-aside {
  background: rgb(21, 24, 45);
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
  background-image: url(https://fs.assets.icraft.ltd/illustrations/lines-bg.svg);
}
</style>

<script setup lang="ts">
import { MessageBox } from "@element-plus/icons-vue";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TokenCacheKey } from "./consts/auth";
import { Layout } from './consts/index';
import { useStore } from "./states/app.state";
import { useAuthStore } from "./states/auth.state";
import { Cache } from "./utils/cache";

const site = import.meta.env.VITE_SITE_NAME
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const LeftCollapsed = ref<boolean>(Cache.get(Layout.AsideCollapsedStatusCacheKey) || false)
const MenuActive = computed<string>(() => route.path)

const onLogout = async () => {
  const appStore = useStore()
  appStore.routeLoading = true;
  Cache.forget(TokenCacheKey)
  authStore.token = ''
  await router.replace({ path: '/auth/login' })
}
</script>