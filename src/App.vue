<script setup lang="ts">
import {useAuthStore} from "./states/auth.state";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Cache} from "./utils/cache";
import {TokenCacheKey} from "./consts/auth";

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

Cache.forever(TokenCacheKey, 'nice')

watch(() => authStore.token, (n, o) => !n && router.push({path: '/auth/login?redirect=' + route.path}))

const checkTokenTicker = ref<number>(0)
onMounted(() => {
  if (!checkTokenTicker.value) {
    checkTokenTicker.value = setInterval(() => authStore.token = Cache.get(TokenCacheKey), 500)
  }
})

onUnmounted(() => {
  // Clear ticker
  if (checkTokenTicker.value) {
    clearInterval(checkTokenTicker.value)
    checkTokenTicker.value = 0
  }
})

</script>

<template>
  <div v-if="authStore.token" class="container w-full">
    <RouterView />
  </div>

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
