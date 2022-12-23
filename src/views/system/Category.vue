<template>
  <div class="container h-full">
    <el-page-header @back="null" class="border-b-0">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3">系统管理</span>
          <span
              class="text-sm"
              style="color: var(--el-text-color-regular)"
          >
            分类列表
          </span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button type="primary">新增</el-button>
          <el-button>导出</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="my-2 mt-5">
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option label="商品分类" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="按名称搜索"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCategory">搜索</el-button>
          <el-button @click="onResetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-page-header>

    <el-empty v-if="!items.length" description="暂无数据.">
      <el-button type="primary">新增</el-button>
    </el-empty>

    <el-table
        :data="items"
        row-key="id"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="cover" label="图标">
        <template #default="scope">
          <el-image v-if="scope.row.cover" class="rounded-full" style="height: 24px" :preview-src-list="[scope.row.cover]" :src="scope.row.cover" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 1 ? '' : 'success'"
              disable-transitions
          >{{ scope.row.status ? '正常' : '禁用' }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="created_at" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default>
          <el-button link type="default" size="small">编辑</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Category as CategoryModel} from "../../models/category";
import {getCategories} from "../../apis/category.api";

onMounted(() => {
  fetchCategory()
})

const items = ref<CategoryModel[]>([])
const fetchCategory = async () => items.value = await getCategories(searchForm)
// Search
const searchDefault = {name: '', type: 0}
const searchForm = reactive(searchDefault)
const onResetSearchForm = () => {
  searchForm.name = ''
  searchForm.type = 0
  fetchCategory()
}
</script>
