<template>
  <el-page-header class="hide-back p-4">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '轮播' }}</b></el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button type="primary" @click="onOp()" icon="Plus" circle />
      </div>
    </template>

    <el-form :inline="true" :model="searchFormModel" class="mt-5">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item class="w-full" label="位置">
            <el-select class="w-full" v-model="searchFormModel.position" placeholder="按位置搜索">
              <el-option :value="-1" label="全部" />
              <el-option v-for="(p, i) of positions" :value="i" :label="p" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full ">
            <el-button :disabled="loading" type="primary" @click="getItems">搜索</el-button>
            <el-button :disabled="loading" @click="onResetSearchForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>

  <div class="mx-4">
    <el-table :border="true" stripe :data="items" row-key="id" highlight-current-row>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="center" width="65" fixed="left" prop="id" label="ID" />
      <el-table-column align="center" fixed="left" width="130" prop="name" label="位置">
        <template #default="scope">
          <el-link>{{ positions[scope.row.position] }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180" prop="visible_begin" label="开始日期" />
      <el-table-column align="center" min-width="180" prop="visible_ending" label="截止日期" />
      <el-table-column align="center" min-width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{
            scope.row.status ? '正常' : '禁用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180" prop="created_at" label="创建时间" />
      <el-table-column align="center" min-width="180" prop="created_at" label="更新时间" />
      <el-table-column align="center" fixed="right" label="操作" min-width="180">
        <template #default="scope">
          <el-button link @click="onOpItems(scope.row.id)" class="hover:text-blue-500">资源</el-button>
          <el-button link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
            icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)" title="确定要删除吗">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
      v-model:page-size="paginate.size" @size-change="(size) => getItems()" :page-sizes="[10, 20, 30, 50, 100]"
      background layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog v-model="opPanelVisible" :title="opForm.id as number > 0 ? '编辑' : '添加'" width="680px" align-center
    class="px-5" destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form status-icon ref="opFormRef" :rules="opFormRules" :model="opForm" label-width="80px" class="w-full">
      <!-- <el-form-item required label="图片">
        <el-upload class="w-full" :class="{ 'hide-upload-btn': opForm.image }" :limit="1" :on-success="onFileUploaded"
          :on-remove="() => opForm.image = ''" accept="image/png,image/jpg,image/jpeg" :file-list="uploadedFiles"
          :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture">
          <el-icon>
            <Upload />
          </el-icon>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="位置" required prop="position">
        <el-select class="w-full" v-model="opForm.position" placeholder="请选择位置">
          <el-option v-for="(p, i) of positions" :value="i" :label="p" />
        </el-select>
      </el-form-item>
      <el-form-item label="样式" required prop="style">
        <el-select class="w-full" v-model="opForm.style" placeholder="请选择展示样式">
          <el-option v-for="p of styles" :value="p.id" :label="p.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期" prop="visible_begin">
        <el-date-picker class="w-full" v-model="opForm.visible_begin" clearable value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime" placeholder="开始日期" />
      </el-form-item>
      <el-form-item label="截止日期" prop="visible_ending">
        <el-date-picker class="w-full" v-model="opForm.visible_ending" clearable value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime" placeholder="截止日期" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="opForm.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!(opForm.id || 0)">
        <el-checkbox v-model="opForm.next">下一步: 配置资源 -> </el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onOpCancel">取消</el-button>
        <el-button :loading="opFormButtonLoading" type="primary" @keydown.enter="onOpSubmit(opFormRef)"
          @click="onOpSubmit(opFormRef)">{{ opForm.id ? '保存' : '添加' }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- End -->

  <!-- Items -->
  <el-dialog v-model="opItemPanelVisible" title="配置资源" size="45%" align-center class="px-5" destroy-on-close>
    <div class="div swiper-preview" style="height: 180px;">
      <el-carousel v-if="item.items?.length" :interval="4000" type="card" height="120px">
        <el-carousel-item v-for="(itm, index) in item.items" :key="index" class="el-carousel-item">
          <el-image fit="contain" :src="itm.image" />
          <el-button @click="onDeleteResource(item.id as number, index)" type="danger" class="delete" icon="Delete"
            circle />
        </el-carousel-item>
      </el-carousel>
      <el-empty :image-size="90" description="暂无资源" style="height: 120px" v-else />
    </div>
    <el-form v-if="(item.items?.length as number) < 5" label-width="80px" ref="form" :model="opItemForm">
      <el-form-item required label="图片" prop="image">
        <el-upload class="w-full" :class="{ 'hide-upload-btn': opItemForm.image }" :limit="1"
          :on-success="onFileUploaded" :on-remove="() => opItemForm.image = ''" accept="image/png,image/jpg,image/jpeg"
          :file-list="uploadedFiles" :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }"
          list-type="picture">
          <el-icon>
            <Upload />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="资源类型" required>
        <el-select class="w-full" v-model="opItemForm.target" placeholder="请选择资源类型">
          <el-option v-for="(p, i) of resourceTypes" :value="i" :label="p" />
        </el-select>
      </el-form-item>
      <el-form-item label="对应资源" prop="">
        <el-input v-if="opItemForm.target == 2" v-model="opItemForm.resource" placeholder="请输入外链网址" />
        <el-select @click="getGoods()" remote filterable clearable :remote-method="(q: string) => getGoods(q)"
          v-if="opItemForm.target == 0" class="w-full" v-model="opItemForm.resource" placeholder="请选择商品">
          <el-option v-for="p of goods" :value="(p.id as number)" :label="p.name" />
        </el-select>
        <el-select @click="getCategories()" v-if="opItemForm.target == 1" class="w-full" v-model="opItemForm.resource"
          placeholder="请选择分类">
          <el-option v-for="p of categories" :value="p.id" :label="p.label" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="样式" required prop="style">
        <el-select class="w-full" v-model="opForm.style" placeholder="请选择展示样式">
          <el-option v-for="p of styles" :value="p.id" :label="p.label" />
        </el-select>
      </el-form-item> -->

      <el-form-item class="w-full ">
        <el-button :disabled="loading" type="primary" @click="onItemOpSubmit">添加</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
  <!-- End Items -->
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 120px;
  margin: 0;
  text-align: center;
}

.el-carousel-item .delete {
  z-index: 11;
  position: absolute;
  right: 10px;
  top: 10px;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<script setup lang="ts">
import { ElMessage, ElNotification, FormInstance, UploadUserFile } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { CategoryAPIs } from "../apis/category.api";
import { GoodsAPIs } from "../apis/goods.api";
import { SwiperAPIs } from "../apis/swiper.api";
import { Response } from "../bags/response";
import { HTTP, UploadApi } from "../consts";
import { Category } from "../models/category";
import { Goods } from "../models/goods";
import { Swiper } from "../models/swiper";
import { useAuthStore } from "../states/auth.state";

onMounted(() => getItems())
const route = useRoute()
const authStore = useAuthStore()
const items = ref<Swiper[]>([])
const paginate = reactive({ page: 1, size: 10, total: 0 })
// Search
const searchFormInit = { position: -1, status: -1 }
const searchFormModel = reactive({ ...searchFormInit })
const loading = ref(false)
const getItems = async () => {
  loading.value = true
  const pRes = await SwiperAPIs.list(paginate.page, paginate.size, searchFormModel)
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
  loading.value = false
}
const onResetSearchForm = () => {
  Object.assign(searchFormModel, { name: '' })
  Object.assign(paginate, { page: 1, total: 0 })
}

const opPanelVisible = ref<boolean>(false)
const opFormButtonLoading = ref<boolean>(false)
/** @ts-ignore */
const opFormInit = { id: 0, position: 0, style: 'fraction', status: 1, visible_begin: '', visible_ending: '', next: false }
const opForm = reactive({ ...opFormInit })
const opFormRef = ref<FormInstance>()


const uploadedFiles = ref<UploadUserFile[]>([])
const onFileUploaded = (response: Response) => opItemForm.image = (response.data as string)

// 配置资源

const goods = ref<Goods[]>([])
const getGoods = async (q: string = '') => {
  const result = await GoodsAPIs.select(q, opItemForm.id)
  goods.value = result.data
}

const categories = ref<Category[]>([])
const getCategories = async (q: string = '') => {
  const result = await CategoryAPIs.select(1)
  goods.value = result.data
}

const item = ref<Swiper>({} as Swiper)
const opItemFormInit = { id: 0, image: '', target: 0, resource: '' }
const opItemForm = reactive({ ...opItemFormInit })
const opItemPanelVisible = ref<boolean>(false)
const onOpItems = async (id: number) => {
  const iRes = await SwiperAPIs.show(id)
  iRes.data.items = iRes.data.items || []
  item.value = iRes.data
  Object.assign(opItemForm, iRes.data)
  opItemPanelVisible.value = true
}

const onDeleteResource = async (id: number, index: number) => {
  let up = { ...item.value, items: item.value.items?.filter((v, i) => i != index) }
  const upRes = await SwiperAPIs.update(id, up)
  if (upRes.code == HTTP.OK) {
    item.value.items = up.items
    ElMessage.success(upRes.msg)
  } else {
    ElMessage.error(upRes.msg)
  }
}

const onItemOpSubmit = async () => {
  item.value.items?.push({ image: opItemForm.image, target: opItemForm.target, resource: opItemForm.resource })
  const upRes = await SwiperAPIs.update(item.value.id as number, item.value)
  if (upRes.code == HTTP.OK) {
    ElMessage.success(upRes.msg)
    Object.assign(opItemForm, opItemFormInit)
    uploadedFiles.value = []
  } else {
    ElMessage.error(upRes.msg)
  }
}

const validatePosition = async (rule: any, value: any, callback: any) => {
  const pRes = await SwiperAPIs.precise('position', value, opForm.id)
  if (pRes.data.length) {
    return callback(new Error('该位置已存在配置，不可重复添加'))
  }

  callback()
}

const opFormRules = reactive<any>({
  position: [{ asyncValidator: validatePosition, trigger: 'blur' }]
})

const positions = ['首页'];
const resourceTypes = ['商品', '分类', '外链']
const styles = [
  { label: '分式', id: 'fraction' },
  { label: '按钮', id: 'controls' },
  { label: '点状', id: 'dots' },
  { label: '点条状', id: 'dots-bar' }
]

const onOp = async (row?: Swiper) => {
  if (row) {
    Object.assign(opForm, row)
  }

  opPanelVisible.value = true
}

const onOpCancel = () => {
  opFormButtonLoading.value = false
  opPanelVisible.value = false
  Object.assign(opForm, opFormInit)
}
const onOpSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (!valid) {
      return
    }
    opFormButtonLoading.value = true
    let res: Response
    if ((opForm.id as number) > 0) {
      res = await SwiperAPIs.update(opForm.id as number, opForm as Swiper)
    } else {
      res = await SwiperAPIs.store(opForm as Swiper);
    }

    opFormButtonLoading.value = false
    if (res.code != HTTP.OK) {
      return ElNotification.warning({ title: res.msg })
    }

    ElNotification.success({ title: '操作成功' })
    await getItems()
    onOpCancel()
  })
}

const onDelete = async (id: number) => {
  const delRes = await SwiperAPIs.destroy(id)
  if (delRes.code == HTTP.OK) {
    ElMessage.success('删除成功')
    getItems()
  }
}

</script>
