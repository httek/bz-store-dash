<template>
  <div class="p-4">
    <span class=" font-bold">{{ authStore.profile?.name }} </span>({{ authStore.profile?.mobile }}) 欢迎您！👏

    <RefreshIcon />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '../states/auth.state';

const authStore = useAuthStore()
</script>
