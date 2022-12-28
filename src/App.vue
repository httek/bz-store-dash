<template>
  <el-container v-if="authStore.token">
    <el-header class="px-0" :height="HeaderHeight + 'px'">
      <el-menu :style="{ height: HeaderHeight + 'px' }" class="m-0 shadow-sm" mode="horizontal" :ellipsis="false"
        text-color="white" background-color="#262f3e">
        <el-menu-item :route="{ path: '/' }" index="0" class="flex hover-row text-white">
          <img class="my-2" src="/vite.svg">
        </el-menu-item>
        <div class="flex-grow" />
        <el-sub-menu index="2">
          <template v-if="authStore.profile" #title>
            <el-icon>
              <User />
            </el-icon>
            {{ authStore.profile?.name }}
          </template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside :width="LeftWidth + 'px'">
        <Sidebar :active="MenuActive" :menus="authStore.menus" :is-collapse="LeftCollapsed" />
      </el-aside>
      <el-container>
        <el-main class="p-0"><RouterView /></el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!-- Auth -->
  <div v-else class="container w-full">
    <div class="flex auth">
      <div class="flex-none w-1/3 left h-screen">
        Auth
      </div>
      <div class="flex-grow h-screen pl-3">
        <div class="flex justify-center items-center pb-9 h-full">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./states/auth.state";
import Sidebar from "./components/Sidebar.vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { BodyMinWidth, HeaderHeight, MaxWidth, MinWidth } from "./consts/sidebar";
import { useRoute } from "vue-router";
import { useStore } from "./states/app.state";

const route = useRoute()
const authStore = useAuthStore()
const appStore = useStore()

const cw = document.documentElement.clientWidth
const LeftCollapsed = ref<boolean>(true)
const LeftWidth = ref<number>(LeftCollapsed.value ? MinWidth : MaxWidth)
const RightWidth = ref<number>(cw > BodyMinWidth ? document.documentElement.clientWidth - LeftWidth.value : BodyMinWidth)
const MenuActive = ref<string>('/')
watch(() => route.path, (n) => MenuActive.value = n)
watch(LeftCollapsed, (n) => LeftWidth.value = n ? MinWidth : MaxWidth)

const resizeRightWidth = () => {
  const cw = document.documentElement.clientWidth
  if (cw > 960) {
    RightWidth.value = cw - LeftWidth.value
  }
}
onMounted(() => {
  window.addEventListener('resize', resizeRightWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeRightWidth)
})
</script>