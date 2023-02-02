<template>
  <el-page-header class="hide-back p-4 mt-2">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '配置管理' }}</b></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button type="primary" icon="Refresh" circle />
      </div>
    </template>
  </el-page-header>

  <div class="m-4">
    <el-tabs @tab-change="onChangeTab" class="h-full">
      <el-tab-pane v-for="g of Cfg.Groups" :label="g.name">
        <view v-if="g.id == Cfg.Group.Swiper" class="swiper w-full">
          <el-page-header class="hide-back py-4">
            <template #content>
              <div class="flex items-center">
                <el-button type="primary" @click="onAdd" icon="Plus" circle />
              </div>
            </template>
          </el-page-header>
          <el-table :border="true" :data="activeItems" row-key="id" highlight-current-row stripe class="w-full">
            <template #empty>
              <el-empty description="暂无数据"></el-empty>
            </template>
            <el-table-column align="left" fixed="left" width="220" prop="mark" label="位置" />
            <el-table-column align="left" prop="value" label="详情">
              <template #default="scope">
                <el-link @click="onEditSwiper(scope.row)" type="primary">{{ scope.row.value.length }} 张图片</el-link>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
            <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
            <el-table-column align="center" fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link @click="onEditSwiper(scope.row)" class="hover:text-blue-500">编辑</el-button>
                <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
                  icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)" :title="'确定要是删除吗?'">
                  <template #reference>
                    <el-button link class="hover:text-red-500">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </view>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- Swiper -->

  <el-dialog width="685px" v-model="swiperPanelVisible" title="{{ currentRow.mark }}" align-center class="px-5"
    destroy-on-close :close-on-press-escape="false" :close-on-click-modal="false">
    {{ Cfg.Groups[active] }}

  </el-dialog>

  <!--  -->
</template>

<style>

</style>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ConfigAPIs } from '../apis/config.api';
import { HTTP } from '../consts';
import { Cfg } from '../consts/config';
import { Config } from '../models/config';

const active = ref<number>(0)
const route = useRoute()
const items = ref<Config[]>([])
const activeItems = ref<Config[]>([])
const currentRow = ref<Config>()
const swiperPanelVisible = ref<boolean>(false)

onMounted(async () => {
  await getList()
  loadActiveTabItems()
})

const loadActiveTabItems = () => {
  activeItems.value = items.value.filter(item => item.group == active.value)
}

const getList = async (group: number = -1) => {
  const res = await ConfigAPIs.get(group)
  items.value = res.data
}

const onChangeTab = (index: any) => {
  active.value = Cfg.Groups[index].id || 0
  loadActiveTabItems()
}

const onAdd = () => {
  console.log(active.value);
}


// 编辑轮播图
const onEditSwiper = (item: Config) => {
  currentRow.value = item
  swiperPanelVisible.value = true
}

const onDelete = async (id: number) => {
  const res = await ConfigAPIs.destroy(id)
  await getList()
  loadActiveTabItems()
  res.code == HTTP.OK && ElMessage.success(res.msg)
}
</script>