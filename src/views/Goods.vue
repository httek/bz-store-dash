<template>
  <el-page-header class="hide-back p-4 bg-gray-50">
    <template #content>
      <div class="flex items-center">
        <span class="text-large font-600 mr-3">
          {{ route.meta.title || '商品' }}
        </span>
        <span class="text-sm" style="color: var(--el-text-color-regular)">
          · 列表
        </span>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button icon="Download" circle />
        <el-button type="primary" icon="Plus" circle />
      </div>
    </template>

    <el-form :inline="true" class="mt-5" :model="searchForm">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item class="w-full" label="按店铺" prop="brand_id">
            <el-select class="w-full" @click="onSearchStore()" v-model="(searchForm.store_id as any)" clearable
              filterable remote reserve-keyword placeholder="按店铺搜索" remote-show-suffix :remote-method="onSearchBrand"
              :loading="loading">
              <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="按品牌" prop="brand_id">
            <el-select class="w-full" @click="onSearchBrand()" v-model="(searchForm.brand_id as any)" clearable
              filterable remote reserve-keyword placeholder="按品牌搜索" remote-show-suffix :remote-method="onSearchBrand"
              :loading="loading">
              <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item class="w-full" label="按分类" prop="category_id">
            <el-select class="w-full" @click="onSearchCategory()" v-model="(searchForm.category_id as any)" clearable
              filterable reserve-keyword placeholder="按分类搜索" remote-show-suffix :loading="loading">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item class="w-full" label="按产品" prop="product_id">
            <el-select class="w-full" @click="onSearchProduct()" v-model="(searchForm.product_id as any)" clearable
              filterable remote reserve-keyword placeholder="按产品搜索" remote-show-suffix :remote-method="onSearchProduct"
              :loading="loading">
              <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="按名称" prop="name">
            <el-input clearable v-model="searchForm.name" placeholder="商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="按状态" prop="status">
            <el-select clearable class="w-full" v-model="(searchForm.status as any)">
              <el-option v-for="(name, index) of statusTypes" :value="index" :label="name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="创建于" prop="created_at">
            <el-date-picker clearable class="w-full" v-model="(searchForm.created_at as any)" value-format="YYYY-MM-DD"
              type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-button icon="Search" :disabled="loading" type="primary" @click="getItems()">搜索</el-button>
          <el-button icon="Refresh" :disabled="loading" @click="onResetSearch()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>
  <div class="p-4">
    <el-table v-loading="loading" style="width: 100% !important;" :border="true" :data="items" row-key="id"
      highlight-current-row stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="center" fixed="left" type="selection" width="55" />
      <el-table-column align="center" fixed="left" prop="store" width="90" label="店铺">
        <template #default="scope">
          <el-tooltip :disabled="!scope.row.store?.name" effect="dark" :content="scope.row.store?.name"
            placement="right">
            <el-avatar v-if="scope.row.images?.length" class="cover" shape="square" :size="36"
              :src="scope.row.images[0]">{{
    scope.row.name.substring(0, 2)
}}
            </el-avatar>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" min-width="120" width="200" prop="name" label="商品名" />
      <el-table-column align="center" fixed="left" prop="images" label="商品图">
        <template #default="scope">
          <el-avatar v-if="scope.row.images?.length" class="cover" shape="square" :size="36"
            :src="scope.row.images[0]">{{
    scope.row.name.substring(0, 2)
}}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" width="100" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type='(statusTagColor[scope.row.status] as any)' disable-transitions>{{
    statusTypes[scope.row.status] ||
    '-'
}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" prop="product.name" label="所属产品" />
      <el-table-column align="center" min-width="120" prop="category.name" label="所属分类" />
      <el-table-column align="center" min-width="120" prop="brand.name" label="所属品牌" />
      <el-table-column align="center" min-width="120" prop="price" label="价格(¥)" />
      <el-table-column align="center" min-width="120" prop="stock" label="库存" />

      <el-table-column align="center" prop="sequence" label="排序" />
      <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
      <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
      <el-table-column align="left" fixed="right" label="操作" width="260">
        <template #default="scope">
          <el-button v-if="scope.row.status" link @click="onDetail(scope.row)" class="hover:text-blue-500">规格
            <small>(0个)</small></el-button>
          <el-button link @click="onDetail(scope.row)" class="hover:text-blue-500">详情</el-button>
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
      <el-pagination layout="total, sizes, prev, pager, next" background
        @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
        @size-change="(size: number) => { paginate.size = size; getItems() }" :total="paginate.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Goods } from '../models/goods';
import { GoodsAPIs as APIs } from '../apis/goods.api';
import { HTTP } from '../consts';
import { ElMessage } from 'element-plus';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { Store } from '../models/store';
import { Delivery } from '../models/delivery';
import { ProductAPIs } from '../apis/product.api';
import { BrandAPIs } from '../apis/brand.api';
import { StoreAPIs } from '../apis/store.api';
import { CategoryAPIs } from '../apis/category.api';
import { useRoute } from 'vue-router';

// Defaults
onMounted(() => getItems())
const route = useRoute()
const loading = ref(false)
const statusTypes = ['待审', '下架', '上架']
const statusTagColor = ["danger", "info", ""]

const products = ref<Product[]>([])
const onSearchProduct = async (q?: string) => products.value = (await ProductAPIs.select(q)).data
const categories = ref<Category[]>([])
const onSearchCategory = async (q?: string) => categories.value = (await CategoryAPIs.selector()).data
const brands = ref<Brand[]>([])
const onSearchBrand = async (q?: string) => brands.value = (await BrandAPIs.select(q)).data
const stores = ref<Store[]>([])
const onSearchStore = async (q?: string) => stores.value = (await StoreAPIs.select(q)).data


// Paginate
const paginate = reactive({ page: 1, size: 10, total: 0 })

// Items
const searchFormInit = { name: '', status: null, category_id: null, store_id: null, brand_id: null, product_id: null, created_at: [] }
const searchForm = reactive({ ...searchFormInit })
const onResetSearch = () => { Object.assign(searchForm, searchFormInit); getItems() }
const items = ref<Goods[]>([])
const getItems = async () => {
  loading.value = true
  const pRes = await APIs.list(
    paginate.page, paginate.size, searchForm as any
  )

  loading.value = false
  Object.assign(paginate, pRes.data)
  items.value = pRes.data.data
}


const onDelete = async (id: number) => {
  const pRes = await APIs.destroy(id)
  if (pRes.code == HTTP.OK) {
    ElMessage.success('操作成功')
    if (items.value.length == 1 && paginate.page > 1) {
      paginate.page = paginate.page - 1
    }

    await getItems()
  }
}
</script>