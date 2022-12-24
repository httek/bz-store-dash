<script setup lang="ts">
import {useAuthStore} from "./states/auth.state";
import Sidebar from "./components/Sidebar.vue";
import {ref, watch} from "vue";
import {HeaderHeight, MaxWidth, MinWidth} from "./consts/sidebar";
import {useRoute} from "vue-router";

const route = useRoute()
const authStore = useAuthStore()

const LeftCollapsed = ref<Boolean>(false)
const LeftWidth = ref<number>(MaxWidth)
const MenuActive = ref<string>('/')
watch(() => route.path, (n) => MenuActive.value = n)
watch(LeftCollapsed, (n) => LeftWidth.value = n ? MinWidth : MaxWidth)
</script>

<template>
  <div v-if="authStore.token" class="container-full w-full">
    <!-- Header -->
    <div class="headers w-full bg-amber-500 text-white" style="background-color: #262f3e">
      <el-menu
          :style="{height: HeaderHeight + 'px'}"
          class="m-0 shadow-sm"
          mode="horizontal"
          :ellipsis="false"
          text-color="white"
          background-color="#262f3e"
      >
        <el-menu-item :route="{path: '/'}" index="0" class="flex hover-row text-white">
          <img class="my-2" src="/vite.svg">
        </el-menu-item>
        <div class="flex-grow" />
        <el-sub-menu index="2">
          <template v-if="authStore.profile" #title> <el-icon><User /></el-icon> {{ authStore.profile.name }}</template>
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
    </div>
    <!-- End Header -->

    <!-- Main -->
    <div class="flex main">
      <div v-loading="!authStore.menus.length" class="left flex-none" :style="{'width': LeftWidth + 'px', backgroundColor: '#1e222d' }">
        <Sidebar
            :active="MenuActive"
            :menus="authStore.menus"
            :style="{width: [LeftWidth + 'px', '!important']}" class="h-full"
            :is-collapse="LeftCollapsed"/>
      </div>
      <div class="flex-grow p-4">
        <RouterView/>
      </div>
    </div>
  </div>
  <!-- End Main -->
  <!-- Auth -->
  <div v-else class="container w-full">
    <div class="flex auth">
      <div class="flex-none w-1/3 left h-screen">
        Auth
      </div>
      <div class="flex-grow h-screen pl-3">
        <div class="flex justify-center items-center pb-9 h-full">
          <RouterView/>
        </div>
      </div>
    </div>
  </div>
</template>
