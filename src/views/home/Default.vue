<template>
  <div class="p-4">
    Welcome
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../../states/auth.state";

const authStore = useAuthStore()
</script>
