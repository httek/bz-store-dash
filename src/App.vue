<script setup lang="ts">
import {useAuthStore} from "./states/auth.state";
import Sidebar from "./components/Sidebar.vue";
import {ref, watch} from "vue";
import {MaxWidth, MinWidth} from "./consts/sidebar";
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
  <!-- Main -->
  <div v-if="authStore.token" class="container-full w-full">
    <!-- Header -->
    <div class="header w-full mb-2 bg-blue-700">
      <div class="logo content-center p-3">
        <img src="/vite.svg">
      </div>
    </div>
    <!-- End Header -->

    <!-- Main -->
    <div class="flex ...">
      <div v-loading="!authStore.menus.length" class="left flex-none h-auto" :style="{'width': LeftWidth + 'px' }">
        <Sidebar
            :active="MenuActive"
            :menus="authStore.menus"
            :style="{width: [LeftWidth + 'px', '!important']}" class="h-full"
            :is-collapse="LeftCollapsed"/>
      </div>
      <div class="flex-grow h-full bg-amber-100 ml-2 p-3">
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
  <!-- End Auth -->
</template>
