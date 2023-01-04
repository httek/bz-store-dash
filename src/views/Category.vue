<template>
  <el-page-header class="hide-back p-4 bg-gray-50">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '分类管理' }}</b></el-breadcrumb-item>
          <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button icon="Download" circle />
        <el-button type="primary" @click="onAddVisible()" icon="Plus" circle />
      </div>
    </template>

    <el-form :inline="true" :model="searchFormModel" class="mt-5">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item class="w-full mb-2" label="名称">
            <el-input v-model="searchFormModel.name" placeholder="按名称搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full mb-2">
            <el-button type="primary" @click="loadCategories">搜索</el-button>
            <el-button @click="onResetSearchForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>

  <el-table class="p-4" :border="true" stripe :data="items" row-key="id" highlight-current-row>
    <template #empty>
      <el-empty description="暂无数据"></el-empty>
    </template>
    <el-table-column align="left" fixed="left" prop="name" label="名称">
      <template #default="scope">
        <el-tag class="ml-2" type="success">{{ scope.row.level }}级</el-tag> {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column align="center" width="80" prop="cover" label="图标">
      <template #default="scope">
        <el-image v-if="scope.row.cover" class="cover rounded" :src="scope.row.cover" fit="contain" />
      </template>
    </el-table-column>
    <el-table-column align="center" width="80" prop="status" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{ scope.row.status ? '正常' : '禁用'
}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" width="100" class="flex justify-center" prop="sequence" label="排序" />
    <el-table-column align="center" prop="created_at" label="创建时间" />
    <el-table-column align="center" prop="created_at" label="更新时间" />
    <el-table-column align="center" fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link @click="onAddVisible(scope.row)" class="hover:text-blue-500">编辑</el-button>
        <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
          icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)" title="确定要删除吗">
          <template #reference>
            <el-button link class="hover:text-red-500">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; loadCategories() }" class="justify-end"
      v-model:page-size="paginate.size" :page-sizes="[10, 20, 30, 50, 100]" background
      layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog v-model="addDialogVisible" :title="addFormModel.id > 0 ? '编辑' : '添加'" width="600px" align-center
    class="px-5" destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form status-icon ref="addFormRef" :rules="addFormRules" :model="addFormModel" label-width="80px" class="w-full">
      <el-form-item label="图片">
        <el-upload class="w-full" :class="{ 'hide-upload-btn': addFormModel.cover }" :limit="1"
          :on-success="onFileUploaded" :on-remove="() => addFormModel.cover = ''"
          accept="image/png,image/jpg,image/jpeg" :file-list="uploadedFiles" :action="UploadApi"
          :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture-card">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="父级">
        <el-tree-select placeholder="父级分类，可选" class="w-full" v-model="addFormModel.parent" :data="categoriesSelector"
          check-strictly />
      </el-form-item>
      <el-form-item label="名称" required prop="name">
        <el-input v-model="addFormModel.name" clearable placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="排序">
        <el-col :span="10">
          <el-form-item>
            <el-input-number :min="0" :max="9999999" placeholder="可选, 分类排序" v-model="addFormModel.sequence"
              controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="4">
          <span class="text-gray-500">状态</span>
        </el-col>
        <el-col :span="10">
          <el-radio-group v-model="addFormModel.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onAddCancel">取消</el-button>
        <el-button :loading="addFormButtonLoading" type="primary" @keydown.enter="onAddSubmit(addFormRef)"
          @click="onAddSubmit(addFormRef)">{{ addFormModel.id ? '保存' : '添加' }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- End -->
</template>
<script setup lang="ts">
import type { FormInstance, UploadUserFile } from "element-plus";
import { ElNotification } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { CategoryAPIs } from "../apis/category.api";
import { Response } from "../bags/response";
import { HTTP, UploadApi } from "../consts";
import { Category as CategoryModel } from "../models/category";
import { useAuthStore } from "../states/auth.state";
import { validators } from "../validators/index";

export interface treeNode {
  value: number
  label: string
  disabled: boolean
  children?: treeNode[] | null
}

onMounted(() => loadCategories())
const route = useRoute()
const authStore = useAuthStore()
const items = ref<CategoryModel[]>([])
const paginate = reactive({ page: 1, size: 10, total: 0 })
// Search
const searchFormInit = { name: '', type: 0 }
const searchFormModel = reactive({ ...searchFormInit })
const loadCategories = async () => {
  const pRes = await CategoryAPIs.list(paginate.page, paginate.size, searchFormModel)
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
}
const onResetSearchForm = () => {
  Object.assign(searchFormModel, { name: '' })
  Object.assign(paginate, { page: 1, size: 10, total: 0 })
  loadCategories()
}

let categoriesSelector = reactive<treeNode[]>([])
function makeTreeNode(item: CategoryModel, disabled?: number): treeNode {
  let node: treeNode = { value: item.id, label: item.name, disabled: disabled == item.id, children: [] }
  if (item.children?.length) {
    for (const child of item.children) {
      node.children?.push(makeTreeNode(child, disabled))
    }
  }

  return node
}

const addDialogVisible = ref<boolean>(false)
const addFormButtonLoading = ref<boolean>(false)
const addFormModelInit = { parent: null, name: '', cover: '', sequence: 0, status: 1, id: 0, type: 0 }
const addFormModel = reactive({ ...addFormModelInit })
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<any>({
  name: [{ validator: validators.nameRequiredWithMin2Len, trigger: 'blur' }]
})

const uploadedFiles = ref<UploadUserFile[]>([])
const onFileUploaded = (response: Response) => addFormModel.cover = (response.data as string)
const getCategorySelector = async (t: number = 0) => {
  categoriesSelector.splice(0)
  const cateRes = (await CategoryAPIs.selector(t)).data
  for (const cate of cateRes) {
    categoriesSelector.push(makeTreeNode(cate, addFormModel.id))
  }
}
const onAddVisible = async (row?: CategoryModel) => {
  const Type = row ? row.type : 0
  await getCategorySelector(Type)

  if (row) {
    Object.assign(addFormModel, row)
    if (row.cover) {
      uploadedFiles.value = [{ name: row.cover, url: row.cover }]
    }
  }

  addDialogVisible.value = true
}

const onAddCancel = () => {
  addFormButtonLoading.value = false
  addDialogVisible.value = false
  Object.assign(addFormModel, addFormModelInit)
  categoriesSelector = []
  uploadedFiles.value = []
}
const onAddSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (!valid) {
      return
    }
    addFormButtonLoading.value = true
    let res: Response
    if (addFormModel.id > 0) {
      res = await CategoryAPIs.update(addFormModel.id, addFormModel as CategoryModel)
    } else {
      res = await CategoryAPIs.store(addFormModel as CategoryModel);
    }

    addFormButtonLoading.value = false
    if (res.code != HTTP.OK) {
      return ElNotification.warning({ title: res.msg })
    }

    ElNotification.success({ title: '操作成功' })
    await loadCategories()
    onAddCancel()
  })
}

const onDelete = async (id: number) => {
  const delRes = await CategoryAPIs.destroy(id)
  if (delRes.code != HTTP.OK) {
    return ElNotification.warning({ title: delRes.msg })
  }

  ElNotification.success({ title: '删除成功' })
  loadCategories()
}

</script>
