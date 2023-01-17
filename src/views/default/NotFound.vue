<template>
  <div class="h-full flex justify-center">
    <el-result class="mb-72 pt-36" title="404" sub-title="页面暂时无法访问">
      <template #icon>
        <el-image fit="contain" style="width: 360px;"
          src="https://fs.assets.icraft.ltd/illustrations/undraw_city_life_gnpr.svg" />
      </template>
      dd
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
const goHome = () => router.replace({ path: '/' })
</script>
