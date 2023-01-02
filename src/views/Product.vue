<template>
  <div class="p-4">
    <PageHeader add-btn @on-add="onOp" :path="['系统管理', `产品列表`]">
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

    <el-table v-loading="loading" style="width: 100% !important;" :border="true" :data="items" row-key="id"
      highlight-current-row stripe>
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
        :page-sizes="[10, 20, 30, 50, 100]" background @size-change="onPageSizeChange"
        layout="total, sizes, prev, pager, next" :total="paginate.total" />
    </div>

    <!-- Add -->
    <el-dialog width="685px" v-model="opPanelVisible" :title="opModel.id > 0 ? '编辑' : '添加'" align-center class="px-5"
      destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form inline status-icon ref="opFormRef" :model="opModel" label-width="80px" class="w-full">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item class="w-full" required label="分类" prop="category_id">
              <el-select class="w-full" v-model="opModel.category_id" filterable remote reserve-keyword clearable
                placeholder="可按名称搜索" remote-show-suffix>
                <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="名称" required prop="name">
              <el-input v-model="opModel.name" clearable placeholder="名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="状态" prop="status">
              <el-radio-group v-model="opModel.status">
                <el-radio-button v-for="(name, index) of statusTypes" :label="index">{{ name }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="排序" prop="sequence">
              <el-input-number class="w-full" placeholder="押金(¥)" v-model="opModel.sequence" controls-position="right"
                :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="w-full" label="图片" prop="logo">
              <el-upload class="w-full" :class="{ 'hide-upload-btn': (opModel.images?.length || 0) >= 3 }" :limit="3"
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
            <el-form-item class="w-full" label="简介">
              <el-input v-model="opModel.description" maxlength="400" placeholder="简介,可选" show-word-limit
                type="textarea" :rows="6" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onOpCancel()">取消</el-button>
          <el-button :loading="opFormButtonLoading" type="primary" @keydown.enter="onOpSubmit(opFormRef)"
            @click="onOpSubmit(opFormRef)">{{ opModel.id ? '保存' : '添加' }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- End Add -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { Product } from '../models/product';
import { ProductAPIs as APIs } from '../apis/product.api';
import { HTTP, UploadApi } from '../consts';
import { Category } from '../models/category';
import { ElMessage, FormInstance, UploadUserFile } from 'element-plus';
import { Response } from '../bags/response';
import { useAuthStore } from '../states/auth.state';
import { CategoryAPIs } from '../apis/category.api';

onMounted(() => getItems())

const authStore = useAuthStore()
const opFormRef = ref<FormInstance>()
const opFormButtonLoading = ref<boolean>(false)
const uploadedFiles = reactive<UploadUserFile[]>([])
const onFileUploaded = (res: Response) => {
  if (res.code == HTTP.OK) {
    uploadedFiles.push({ name: res.data, url: res.data })
    opModel.images?.push(res.data)
  }
}
const onRemoveImage = (file: UploadUserFile) => opModel.images = opModel.images.filter(item => item != file.name)
const statusTypes = ['待审', '下架', '上架']
const statusTagColor = ["danger", "info", ""]

const loading = ref<boolean>(false)
const searchFormInit = { status: -1, id: 0, name: '' }
const searchForm = reactive({ ...searchFormInit })
const paginate = reactive({ page: 1, size: 10, total: 0 })
const onPageSizeChange = (size: number) => {
  paginate.size = size; getItems()
}
const items = ref<Product[]>([])
const getItems = async () => {
  loading.value = true
  const pRes = await APIs.list(paginate.page, paginate.size, searchForm as Product)
  loading.value = false
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
}

const categories = reactive<Category[]>([])
const searchCategories = () => { }
const opModelInit = { id: 0, category_id: undefined, name: '', images: [], description: '', status: 2, sequence: 0 }
const opPanelVisible = ref<boolean>(false)
const opModel = reactive<Product>({ ...opModelInit })
watch(() => opPanelVisible.value, async (n) => {
  if (n) {
    categories.length = 0
    const res = await CategoryAPIs.selector()
    res.data.map((c: Category) => categories.push(c))
  }
})

const onOp = (row?: Product) => {
  if (row) {
    Object.assign(opModel, row)
    row.images?.map(image => uploadedFiles.push({ name: image, url: image }))
  }

  categories.length = 0
  opPanelVisible.value = true
}

const onOpSubmit = (form: FormInstance | undefined) => {
  form?.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }

    opFormButtonLoading.value = true
    let res: Response
    if (opModel.id > 0) {
      res = await APIs.update(opModel.id, opModel)
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

const onOpCancel = () => {
  opModel.images = []
  uploadedFiles.length = 0
  opPanelVisible.value = false
  Object.assign(opModel, opModelInit)
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