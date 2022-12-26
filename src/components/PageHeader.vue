<template>
  <div class="...">
    <div class="flex w-full">
      <div v-if="path.length > 0" class="flex-none w-80 py-3">
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(p, i) of path">
            <template v-if="i < path.length - 1">
              <span class="font-bold">{{ p }}</span>
            </template>
            <template v-else>{{ p }}</template>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="flex-grow flex justify-end">
        <el-tooltip
            v-if="exportBtn"
            effect="dark"
            content="导出"
            placement="bottom-start"
        >
          <el-button class="mt-1" @click="$emit('onExport')" icon="Download" circle/>
        </el-tooltip>
        <el-tooltip
            v-if="addBtn"
            effect="dark"
            content="新增"
            placement="bottom-start"
        >
          <el-button class="mt-1" type="primary" @click="$emit('on-add')" icon="Plus" circle/>
        </el-tooltip>
      </div>
    </div>
    <el-divider class="my-3" content-position="left"/>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
defineEmits(['on-add', 'on-export'])
defineProps<{
  path: string[]
  addBtn?: boolean
  exportBtn?: boolean
}>()
</script>
