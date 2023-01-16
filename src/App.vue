<template>
  <el-container v-if="authStore.token" :class="['h-screen']" class="p-0">
    <el-header class="header bg-slate-900 text-white overflow-hidden p-0"
      :style="{ height: `${Layout.HeaderHeight}px` }">
      <el-menu :style="{ height: `${Layout.HeaderHeight}px` }" class=" bg-slate-900 text-white border-0"
        text-color="white" mode="horizontal" :ellipsis="false">
        <el-menu-item index="0">
          <el-image src="/vite.svg" /> <span class="ml-4 font-bold">{{ site }}</span>
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1" v-if="authStore.profile">
          <el-icon>
            <User />
          </el-icon> {{ authStore.profile?.name }}
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container :style="{ height: `calc(100vh - ${Layout.HeaderHeight}px)` }" class="p-0">
      <el-aside class="h-full bg-slate-900" :style="{ width: `${Layout.AsideMaxWidth}px` }">
        <el-scrollbar>
          <Sidebar :active="MenuActive" :menus="authStore.menus" :is-collapse="LeftCollapsed" />
        </el-scrollbar>
      </el-aside>
      <el-main class="p-0 overflow-x-hidden">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
  <!-- Auth -->
  <el-container v-else>
    <el-aside width="200px">Aside</el-aside>
    <el-main>
      <el-scrollbar>
        <RouterView />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
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