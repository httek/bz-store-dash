<template>
  <div class="p-4">
    <PageHeader add-btn :path="['系统管理', `产品列表`]">
      <template #default>
        <el-form :inline="true" class="my-2 mt-5">
          <el-form-item class="mb-2" label="名称">
            <el-input v-model="searchForm.name" placeholder="按名称搜索" />
          </el-form-item>
          <el-form-item class="mb-2" label="状态">
            <el-select v-model="searchForm.status">
              <el-option :value="-1" label="全部" />
              <el-option v-for="(name, index) of statusTypes" :value="index" :label="name" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button @click="getItems()" type="primary">搜索</el-button>
            <el-button @click="Object.assign(searchForm, searchFormInit); getItems()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </PageHeader>

    <el-table style="width: 100% !important;" :border="true" :data="items" row-key="id" highlight-current-row stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="left" fixed="left" prop="id" label="ID" />
      <el-table-column align="center" fixed="left" min-width="120" prop="name" label="名称" />
      <el-table-column align="center" prop="images" label="图片">
        <template #default="scope">
          <el-avatar v-if="scope.row.images?.length" class="cover" shape="square" :size="36"
            :src="scope.row.images[0]">{{
    scope.row.name.substring(0, 2)
}}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category.name" label="分类" />
      <el-table-column align="center" width="100" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="statusTagColor[scope.row.status]" disable-transitions>{{ statusTypes[scope.row.status] ||
    '-'
}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sequence" label="排序" />
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

    <div class="flex justify-end w-full mt-4" v-if="items.length">
      <el-pagination @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
        v-model:page-size="paginate.size" :page-sizes="[10, 20, 30, 50, 100]" background
        layout="total, sizes, prev, pager, next" :total="paginate.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Product } from '../models/product';
import { ProductAPIs as APIs } from '../apis/product.api';

onMounted(() => getItems())

const statusTypes = ['待审', '下架', '上架']
const statusTagColor = ["danger", "info", ""]

const searchFormInit = { status: -1 }
const searchForm = reactive<Product>({ ...searchFormInit })
const paginate = reactive({ page: 1, size: 10, total: 0 })
const items = ref<Product[]>([])
const getItems = async () => {
  const pRes = await APIs.list(paginate.page, paginate.size, searchForm)
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
}

</script>