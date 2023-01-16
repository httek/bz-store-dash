<template>
  <div class="h-full flex justify-center">
    <el-result class="mb-72" title="403" sub-title="您无权查看此网页">
      <template #icon>
        <el-image src="../../assets/vue.svg" />
      </template>
      <template #extra>
        <el-button link @click="goHome()" type="primary">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
const goHome = () => router.replace({ path: '/' })
</script>
