<template>
  <div class="p-4">
    <PageHeader add-btn :path="['系统管理', `品牌列表`]">
      <template #default>
        <el-form :inline="true" class="my-2 mt-5">
          <el-form-item class="mb-2" label="名称">
            <el-input placeholder="按名称搜索" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary">搜索</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </PageHeader>

    <el-table style="width: 100% !important;" :border="true" :data="items" row-key="id" highlight-current-row stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" prop="name" label="名称" />
      <el-table-column align="center" prop="logo" label="Logo">
        <template #default="scope">
          <el-avatar class="cover" shape="square" :size="36" :src="scope.row.logo">{{ scope.row.name.substring(0, 2) }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="site" label="官网">
        <template #default="scope">
          <el-link v-if="scope.row.site" :href="scope.row.site" type="primary" target="_blank">
            查看
            <el-icon class="ml-1">
              <Link />
            </el-icon>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category.name" label="分类" />
      <el-table-column align="center" prop="sequence" label="排序" />
      <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BrandAPIs } from '../apis/brand.api';
import { Brand } from '../models/brand';


const items = ref<Brand[]>([])
const getItems = async () => {
  const pRes = await BrandAPIs.list()
  items.value = pRes.data.data
}

onMounted(() => getItems())


</script>