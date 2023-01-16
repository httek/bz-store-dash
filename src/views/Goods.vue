<template>
  <el-page-header class="hide-back p-4">
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
        <el-button type="primary" @click="onOp()" icon="Plus" circle />
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
          <el-button :disabled="loading" type="primary" @click="getItems()">搜索</el-button>
          <el-button :disabled="loading" @click="onResetSearch()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>
  <div class="p-4">
    <el-table border :data="items" row-key="id" stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="center" fixed="left" prop="id" width="90" label="ID" />
      <el-table-column align="center" fixed="left" prop="name" width="200" label="名称" />
      <el-table-column align="center" prop="images" width="80" label="图片">
        <template #default="scope">
          <el-popover placement="right">
            <template #reference>
              <el-avatar shape="square" class="cover" :src="scope.row.covers[0] || null" />
            </template>
            <template #default>
              <el-row :gutter="5" class="flex justify-center content-center">
                <el-col v-for="image of scope.row.covers" :span="12">
                  <el-image style="height: 60px" :src="image" fit="cover" />
                </el-col>
              </el-row>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="status" label="状态">
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
      <el-table-column align="center" prop="store.name" width="90" label="所属店铺" />
      <el-table-column align="center" min-width="120" prop="brand.name" label="所属品牌" />
      <el-table-column align="center" min-width="120" prop="sale_price" label="价格(¥)" />
      <el-table-column align="center" min-width="120" prop="stock" label="库存" />

      <el-table-column align="center" prop="sequence" label="排序" />
      <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
      <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
      <el-table-column align="left" fixed="right" width="160" label="操作">
        <template #default="scope">
          <el-button link @click="onDetailVisible(scope.row.id)" class="hover:text-blue-500">详情</el-button>
          <el-button link @click="onOp(scope.row as Goods)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
            icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)" :title="'确定要是删除吗?'">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
          <!-- <el-divider direction="vertical" />
          <el-dropdown>
            <el-button link>
              <el-icon class="pt-1 font-bold">
                <Operation />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="Update(scope.row.id, { status: 2 })" icon="Checked">上架</el-dropdown-item>
                <el-dropdown-item @click="Update(scope.row.id, { status: 1 })" icon="Failed">下架</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end w-full mt-4" v-if="items.length">
      <el-pagination layout="total, sizes, prev, pager, next" background
        @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
        @size-change="(size: number) => { paginate.size = size; getItems() }" :total="paginate.total" />
    </div>
  </div>
  <!-- Detail -->
  <el-drawer v-model="detailPanelVisible" :title="visible.name + ' - 详情'" size="50%">
    <h2 class="my-2 font-bold">商品信息</h2>
    <el-descriptions :column="2" border>
      <el-descriptions-item label-align="right" label="商品ID">{{ visible.id }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品编号">{{
        visible.uuid
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品名称">{{ visible.name }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="所属店铺">{{
        visible.store?.name
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品状态">
        <el-tag :type="(statusTagColor[visible.status as number] as any)">{{
          statusTypes[visible.status as number] ||
            '-'
        }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品价格">¥ {{
        visible.sale_price
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品原价">¥ {{
        visible.origin_price
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="所属分类">
        <el-tag> {{ visible.category?.name }} </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="所属产品">{{
        visible.product?.name
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="所属品牌">{{
        visible.brand?.name
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="配送方式">{{
        visible.delivery?.name
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品排序">{{
        visible.sequence
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品库存">{{
        visible.stock
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品已售">{{
        visible.sold
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="是否包邮">{{
        visible.free_shipping ? '是' : '否'
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="包邮">{{
        visible.free_shipping ? '是' : '否'
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品资材">{{
        visible.material
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品角标">{{
        visible.badge
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="购买提示">{{
        visible.tips
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品标签">{{
        visible.tags?.join(', ')
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="商品描述">{{
        visible.description
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="推荐语">{{
        visible.slogan
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="创建时间">{{
        visible.created_at
      }}</el-descriptions-item>
      <el-descriptions-item label-align="right" label="更新时间">{{
        visible.updated_at
      }}</el-descriptions-item>
    </el-descriptions>

    <h2 class="my-2 font-bold">商品图片</h2>
    <el-row :gutter="20" class=" rounded">
      <el-col :span="3" v-for="i of visible.covers">
        <el-image style="max-height: 100px" fit="cover" :src="i" />
      </el-col>
    </el-row>
    <h2 class="my-2 font-bold">详情图片</h2>
    <div class="detail bg-slate-100 rounded"
      :style="{ height: (visible.detail?.length ? '700px;' : ''), overflowY: 'scroll' }">
      <el-empty v-if="!visible.detail?.length"></el-empty>
      <el-image v-else v-for="(url, index) in visible.detail" :key="index" :src="url" class="block" />
    </div>
  </el-drawer>
  <!-- End -->

  <!-- Add -->
  <el-drawer :close-on-press-escape="false" :show-close="false" destroy-on-close :close-on-click-modal="false"
    v-model="opPanelVisible" @closed="onOpCancel" :title="(opModel.id || 0) > 0 ? '编辑' : '添加'" size="55%">
    <el-form :rules="opFormRules" ref="opFormRef" inline status-icon :model="opModel" label-width="80px" class="w-full">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item class="w-full" required label="所属店铺" prop="store_id">
            <el-select class="w-full" v-model="opModel.store_id" filterable remote reserve-keyword clearable
              placeholder="可按名称搜索" remote-show-suffix>
              <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" required label="所属产品" prop="product_id">
            <el-select class="w-full" v-model="opModel.product_id" filterable remote reserve-keyword clearable
              placeholder="可按名称搜索" remote-show-suffix>
              <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" required label="商品分类" prop="category_id">
            <el-select class="w-full" v-model="opModel.category_id" filterable remote reserve-keyword clearable
              placeholder="可按名称搜索" remote-show-suffix>
              <el-option-group v-for="cate in categories" :key="cate.id" :label="cate.name">
                <el-option v-for="item in cate.children" :key="item.id" :label="item.name" :value="item.id" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品品牌" prop="category_id">
            <el-select class="w-full" v-model="opModel.brand_id" filterable remote reserve-keyword clearable
              placeholder="可按名称搜索" remote-show-suffix>
              <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="配送模版" prop="delivery_id">
            <el-select class="w-full" v-model="opModel.delivery_id" filterable remote reserve-keyword clearable
              placeholder="可按名称搜索" remote-show-suffix>
              <el-option v-for="item in deliveries" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品名称" required prop="name">
            <el-input v-model="opModel.name" show-word-limit maxlength="40" clearable placeholder="商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品价格" prop="sala_price">
            <el-input-number :precision="2" class="w-full" placeholder="金额(¥)" v-model="opModel.sale_price"
              controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品原价" prop="origin_price">
            <el-input-number :precision="2" class="w-full" placeholder="原价(¥)" v-model="opModel.origin_price"
              controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品库存" prop="stock">
            <el-input v-model="opModel.stock" clearable placeholder="商品库存" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品已售" prop="sold">
            <el-input-number class="w-full" placeholder="商品已售" v-model="opModel.sold" controls-position="right"
              :min="0" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="导购推荐" prop="slogan">
            <el-input v-model="opModel.slogan" clearable placeholder="推荐语" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="商品角标" prop="badge">
            <el-input v-model="opModel.badge" clearable placeholder="商品角标" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="购买提示" prop="tips">
            <el-input v-model="opModel.tips" clearable placeholder="购买提示" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品标签" prop="tags">
            <el-select clearable v-model="opModel.tags" multiple collapse-tags placeholder="选择商品标签" class="w-full">
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品资材" prop="material">
            <el-input v-model="opModel.material" clearable placeholder="商品资材" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品排序" prop="sequence">
            <el-input-number class="w-full" placeholder="商品排序" v-model="opModel.sequence" controls-position="right"
              :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商品状态" prop="status">
            <el-radio-group v-model="opModel.status">
              <el-radio v-for="(name, index) of statusTypes" :label="index">{{ name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="商品图片" required prop="covers">
            <el-upload class="w-full" :class="{ 'hide-upload-btn': (opModel.covers?.length || 0) >= 6 }" :limit="6"
              :on-success="onFileUploaded" :on-remove="onRemoveImage" accept="image/png,image/jpg,image/jpeg"
              :file-list="uploadedFiles" :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }"
              list-type="picture-card">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="详情图片" prop="logo">
            <el-upload class="w-full" :class="{ 'hide-upload-btn': (opModel.detail?.length || 0) >= 9 }" :limit="9"
              :on-success="onDetailFileUploaded" :on-remove="onRemoveDetailImage"
              accept="image/png,image/jpg,image/jpeg" :file-list="uploadedDetailFiles" :action="UploadApi"
              :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture-card">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="商品简介">
            <el-input v-model="opModel.description" maxlength="200" placeholder="简介,可选" show-word-limit type="textarea"
              :rows="6" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onOpCancel">取消</el-button>
        <el-button @click="onOpSubmit(opFormRef)" type="primary" :loading="opFormButtonLoading">
          {{ opModel.id ? '保存' : '添加' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
  <!-- End Add -->
</template>
<style scoped lang="css">
.detail {
  overflow-y: scroll !important;
}
</style>
<script setup lang="ts">
import { ElMessage, FormInstance, UploadUserFile } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BrandAPIs } from '../apis/brand.api';
import { CategoryAPIs } from '../apis/category.api';
import { DeliveryAPIs } from '../apis/delivery.api';
import { GoodsAPIs as APIs } from '../apis/goods.api';
import { ProductAPIs } from '../apis/product.api';
import { StoreAPIs } from '../apis/store.api';
import { TagAPIs } from '../apis/tag.api';
import { Response } from '../bags/response';
import { HTTP, UploadApi } from '../consts';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { Delivery } from '../models/delivery';
import { Goods } from '../models/goods';
import { Product } from '../models/product';
import { Store } from '../models/store';
import { Tag } from '../models/tag';
import { useAuthStore } from '../states/auth.state';
import { validateCovers, validateName, validateUnSelected } from './goods';

// Defaults
onMounted(() => getItems())
const route = useRoute()
const loading = ref(false)
const statusTypes = ['待审', '下架', '上架']
const statusTagColor = ["danger", "info", ""]
const authStore = useAuthStore()

const products = ref<Product[]>([])
const onSearchProduct = async (q?: string) => products.value = (await ProductAPIs.select(q)).data
const categories = ref<Category[]>([])
const onSearchCategory = async (t: number = 1) => categories.value = (await CategoryAPIs.select(t)).data
const brands = ref<Brand[]>([])
const onSearchBrand = async (q?: string) => brands.value = (await BrandAPIs.select(q)).data
const stores = ref<Store[]>([])
const onSearchStore = async (q?: string) => stores.value = (await StoreAPIs.select(q)).data
const deliveries = ref<Delivery[]>([])
const onSearchDelivery = async () => deliveries.value = (await DeliveryAPIs.select()).data
const tags = ref<Tag[]>([])
const onSearchTag = async () => tags.value = (await TagAPIs.select()).data

// Paginate
const paginate = reactive({ page: 1, size: 10, total: 0 })

// Items
const searchFormInit = { name: '', tags: [], status: null, category_id: null, store_id: null, brand_id: null, product_id: null, created_at: [] }
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

// Show
const detailPanelVisible = ref(false)
const visible = ref<Goods>({})
const onDetailVisible = async (id: number) => {
  // const item = items.value.find(el => el.id = id) as Goods
  const item = (await APIs.find(id)).data as Goods
  if (!item) return ElMessage.error('数据异常')

  detailPanelVisible.value = true
  visible.value = item
}
// Add
const opFormRef = ref<FormInstance>()
const opModelInit: Goods = {
  id: 0, sequence: 0, stock: 9999, sold: 0, sale_price: 0,
  origin_price: 0, covers: [], status: 2, store_id: undefined,
  product_id: undefined, category_id: undefined, name: '',
  slogan: '', tags: [], badge: '', delivery_id: undefined,
  detail: [], brand_id: undefined, tips: '', material: '',
  description: ''
}
const opModel = reactive<Goods>({ ...opModelInit })
const opPanelVisible = ref(false)
const uploadedFiles = reactive<UploadUserFile[]>([])
const uploadedDetailFiles = reactive<UploadUserFile[]>([])
const opFormButtonLoading = ref<boolean>(false)

const onRemoveImage = (file: UploadUserFile) => opModel.covers = opModel.covers?.filter(item => item != file.name)
const onRemoveDetailImage = (file: UploadUserFile) => opModel.detail = opModel.detail?.filter(item => item != file.name)
const onFileUploaded = (res: Response) => {
  if (res.code == HTTP.OK) {
    uploadedFiles.push({ name: res.data, url: res.data })
    opModel.covers?.push(res.data)
  }
}

const onDetailFileUploaded = (res: Response) => {
  if (res.code == HTTP.OK) {
    uploadedDetailFiles.push({ name: res.data, url: res.data })
    opModel.detail?.push(res.data)
  }
}

const opFormRules = reactive({
  name: [{ asyncValidator: validateName, trigger: 'blur' }],
  store_id: [{ validator: validateUnSelected, trigger: 'blur' }],
  category_id: [{ validator: validateUnSelected, trigger: 'blur' }],
  product_id: [{ validator: validateUnSelected, trigger: 'blur' }],
  covers: [{ validator: validateCovers, trigger: 'blur' }]
})

const onOp = async (row?: Goods) => {
  if (row) {
    row.covers = row.covers ? row.covers : []
    row.detail = row.detail ? row.detail : []
    Object.assign(opModel, row)
    uploadedFiles.length = 0
    uploadedDetailFiles.length = 0
    row.covers?.map(image => uploadedFiles.push({ name: image, url: image }))
    row.detail?.map(image => uploadedDetailFiles.push({ name: image, url: image }))
  }

  else {
    Object.assign(opModel, opModelInit)
  }

  opPanelVisible.value = true
  // categories.value.length = 0
  await onSearchCategory()
  await onSearchProduct()
  await onSearchStore()
  await onSearchBrand()
  await onSearchDelivery()
  await onSearchTag()
}

const onOpSubmit = (form: FormInstance | undefined) => {
  form?.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }

    opFormButtonLoading.value = true
    let res: Response
    if ((opModel.id || 0) > 0) {
      res = await APIs.update(opModel.id as number, opModel)
    } else {
      res = await APIs.store(opModel);
    }

    opFormButtonLoading.value = false
    if (res.code == HTTP.OK) {
      ElMessage.success(res.msg)
      onOpCancel()
      getItems()
    }
  })
}

const Update = async (id: number, data: any, refresh: boolean = true) => {
  const res = await APIs.update(id, data)
  res.code == HTTP.OK && refresh && getItems()
}

const onOpCancel = () => {
  opModel.covers = []
  uploadedFiles.length = 0
  uploadedDetailFiles.length = 0
  Object.assign(opModel, opModelInit)
  opPanelVisible.value = false
}
</script>