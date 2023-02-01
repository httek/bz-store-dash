<template>
  <el-page-header class="hide-back p-4">
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
        <el-button type="primary" @click="onOp()" icon="Plus" circle />
      </div>
    </template>
  </el-page-header>

  <div class="mx-4">
    {{ activeItems }}
    <el-tabs type="border-card" @tab-change="onChangeTab" class="h-full">
      <el-tab-pane v-for="g of Cfg.Groups" :label="g.name">
        <view v-if="g.id == Cfg.Group.Default" class="swiper w-full">
          <el-table :border="true" :data="activeItems" row-key="id" highlight-current-row stripe class="w-full">
            <template #empty>
              <el-empty description="暂无数据"></el-empty>
            </template>
            <el-table-column align="left" fixed="left" width="220" prop="key" label="Key" />
            <el-table-column align="left" fixed="left" width="220" prop="key" label="备注" />
            <el-table-column align="left" fixed="left" width="220" prop="mark" label="图片">
              <template #default="scope">
                <el-avatar class="cover" shape="square" :size="36" :src="scope.row.cover">{{
                  scope.row.name.substring(0,
                    2)
                }}
                </el-avatar>
                {{ scope.row.name }}
              </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
            <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
            <el-table-column align="center" fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
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
</template>

<style>
.swiper {
  display: flex;
  justify-content: center;
}

.swiper .left {
  width: 400px;

}

.swiper .right {
  flex-grow: 1;
  border: 1px solid red;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ConfigAPIs } from '../apis/config.api';
import { Cfg } from '../consts/config';
import { Config } from '../models/config';

onMounted(async () => {
  await getList()
  activeItems.value = items.value.filter(item => item.group == 0 as any)
})

const route = useRoute()
const items = ref<Config[]>([])
const activeItems = ref<Config[]>([])

const getList = async (group: number = -1) => {
  const res = await ConfigAPIs.get(group)
  items.value = res.data
}

const onChangeTab = (group: any) => {
  activeItems.value = items.value.filter(item => item.group == group)
}

const onOp = () => {
  console.log('onOp');
}
</script>