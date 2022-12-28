<template>
  <el-container v-if="authStore.token">
    <el-header class="px-0" :height="Layout.HeaderHeight + 'px'">
      <el-menu :style="{ height: Layout.HeaderHeight + 'px' }" class="m-0 shadow-sm" mode="horizontal" :ellipsis="false"
        text-color="white" background-color="#262f3e">
        <el-menu-item :route="{ path: '/' }" index="0" class="flex hover-row text-white">
          <img class="my-2" src="/vite.svg">
        </el-menu-item>
        <div class="flex-grow" />
        <el-sub-menu index="2" class="rounded">
          <template v-if="authStore.profile" #title>
            <el-icon>
              <User />
            </el-icon>
            {{ authStore.profile?.name }}
          </template>
          <el-menu-item index="2-1">账号信息</el-menu-item>
          <el-menu-item index="2-1">消息中心</el-menu-item>
          <el-menu-item @click="onLogout" index="2-2">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside :width="LeftWidth + 'px'">
        <Sidebar :active="MenuActive" :menus="authStore.menus" :is-collapse="LeftCollapsed" />
      </el-aside>
      <el-container>
        <el-main :v-loading="appStore.routeLoading" class="p-0">
          <RouterView />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!-- Auth -->
  <el-container v-else>
    <el-aside width="200px">Aside</el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "./states/auth.state";
import Sidebar from "./components/Sidebar.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Cache } from "./utils/cache";
import {Layout} from './consts/index'
import { computed } from "@vue/reactivity";
import { TokenCacheKey } from "./consts/auth";
import { useStore } from "./states/app.state";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useStore()

const LeftCollapsed = ref<boolean>(Cache.get(Layout.AsideCollapsedStatusCacheKey) || true)
const LeftWidth = computed<number>(() => LeftCollapsed.value ? Layout.AsideMinWidth : Layout.AsideMaxWidth)
const MenuActive = computed<string>(() => route.path)

const onLogout = async () => {
  const appStore = useStore()
  appStore.routeLoading = true;
  // Cache.forget(TokenCacheKey)
  // authStore.token = ''
  // await router.replace({path: '/auth/login'})
}
</script>