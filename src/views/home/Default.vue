<template>
  <h1>Default Home</h1>

  <pre>{{ authStore.menus }}</pre>
</template>

<script lang="ts" setup>
import {useAuthStore} from "../../states/auth.state";

const authStore = useAuthStore()
</script>
