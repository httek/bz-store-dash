<template>
  <div class="container py-2">
    <!-- Page Header -->
    <el-page-header>
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3">系统管理</span>
          <span class="text-sm">商户列表</span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button type="primary" @click="onAddVisible" icon="Plus" circle />
        </div>
      </template>
      <el-form :inline="true" :model="searchFormModel" class="my-2 mt-5">
        <el-form-item label="类型">
          <el-select v-model="searchFormModel.type" placeholder="请选择类型">
            <el-option label="商品分类" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchFormModel.name" placeholder="按名称搜索"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCategoryList">搜索</el-button>
          <el-button @click="onResetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-page-header>

    <!-- Empty data. -->
    <el-empty v-if="!items.length" class="mt-36" description="暂无数据."/>

    <!-- Data view -->
    <el-table
        stripe
        v-if="items.length"
        :data="items"
        row-key="id"
        :default-expand-all="true"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="cover" label="图标">
        <template #default="scope">
          <el-image
              v-if="scope.row.cover" class="rounded-full"
              style="height: 24px"
              :preview-src-list="[scope.row.cover]"
              :src="scope.row.cover" fit="contain"/>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 1 ? 'primary' : 'danger'"
              disable-transitions
          >{{ scope.row.status ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sequence" label="排序"/>
      <el-table-column prop="created_at" label="创建时间"/>
      <el-table-column prop="created_at" label="更新时间"/>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link @click="onAddVisible(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm
              confirm-button-text="确定"
              confirm-button-type="danger"
              cancel-button-text="取消"
              icon-color="#626AEF"
              width="200px"
              @confirm="onDelete(scope.row.id, $event)"
              :title="scope.row.level <= 2 ? '确定要删除吗(所属子分类也会被删除)?' : '确定要是删除吗?'"
          >
            <template #reference>
              <el-button link class="hover:text-red-500" >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add -->
    <el-dialog
        v-model="addDialogVisible"
        :title="currentOnEdit > 0 ? '编辑分类' : '添加分类'"
        width="600px"
        align-center
        class="px-5"
        destroy-on-close
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
      <el-form
          status-icon
          ref="addFormRef"
          :rules="addFormRules"
          :model="addFormModel" label-width="80px" class="w-full">
        <el-form-item label="父级">
          <el-tree-select
              placeholder="父级分类，可选"
              class="w-full"
              v-model="addFormModel.parent"
              :data="categoriesSelector"
              check-strictly
              :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="名称" required prop="name">
          <el-input autofocus v-model="addFormModel.name" clearable placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
              accept="image/png,image/jpg,image/jpeg"
              class="w-full"
              v-model="addFormModel.cover"
              :action="UploadApi"
              :headers="{Authorization: 'Bearer ' + authStore.token}"
              list-type="picture"
              :limit="1"
              :on-success="onFileUploaded"
              :on-remove="() => addFormModel.cover = null"
          >
            <el-icon size="24" class="mr-4 text-blue-500">
              <UploadFilled/>
            </el-icon>
            选择文件
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-col :span="10">
            <el-form-item>
              <el-input-number
                  placeholder="可选, 分类排序"
                  v-model="addFormModel.sequence"
                  controls-position="right"
              />
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
          <el-button :loading="addFormButtonLoading" type="primary" @keydown.enter="onAddSubmit(addFormRef)" @click="onAddSubmit(addFormRef)">{{ addFormModel.id ? '保存' : '添加'}}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- End Add -->
  </div>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Category as CategoryModel} from "../../models/category";
import {getCategories, getCategoriesSelector, addCategory, delCategory, updateCategory} from "../../apis/category.api";
import {UploadApi} from "../../consts";
import {useAuthStore} from "../../states/auth.state";
import {Response} from "../../bags/response";
import type {FormInstance} from "element-plus";
import {validateName} from "./category/validator";
import {ElNotification} from "element-plus";

onMounted(() => getCategoryList())
const authStore = useAuthStore()
const items = ref<CategoryModel[]>([])
// Search
const searchFormInit = {name: '', type: 0}
const searchFormModel = reactive({...searchFormInit})
const getCategoryList = async () => items.value = await getCategories(searchFormModel)
const onResetSearchForm = () => {
  Object.assign(searchFormModel, searchFormInit)
  getCategoryList()
}

export interface treeNode {
  value: number,
  label: string,
  children?: treeNode[] | null
}

let categoriesSelector = reactive<treeNode[]>([])

function makeTreeNode(item: CategoryModel): treeNode {
  let node: treeNode = {value: item.id, label: item.name, children: []}
  if (item.children?.length) {
    for (const child of item.children) {
      node.children?.push(makeTreeNode(child))
    }
  }

  return node
}

const addDialogVisible = ref<boolean>(false)
const addFormButtonLoading = ref<boolean>(false)
const addFormModelInit = {parent: null, name: '', cover: '', sequence: 0, status: 1, id: 0}
const addFormModel = reactive({...addFormModelInit})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive({
  name: [{validator: validateName, trigger: 'blur'}]
})
const onFileUploaded = (response: Response) => addFormModel.cover = (response.data as string)
const onAddVisible = async (row?: CategoryModel) => {
  const cateRes = await getCategoriesSelector()
  for (const cate of cateRes) {
    categoriesSelector.push(makeTreeNode(cate))
  }

  if (row) {
    Object.assign(addFormModel, row)
  }

  addDialogVisible.value = true
}
const onAddCancel = () => {
  addFormButtonLoading.value = false
  addDialogVisible.value = false
  Object.assign(addFormModel, addFormModelInit)
  categoriesSelector = []
}
const onAddSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (!valid) {
      return
    }
    addFormButtonLoading.value = true
    let res: Response
    if (addFormModel.id > 0) {
      res = await updateCategory(addFormModel.id, addFormModel as CategoryModel)
    } else {
      res = await addCategory(addFormModel as CategoryModel);
    }
    addFormButtonLoading.value = false
    ElNotification.success({title: '操作成功'})
    getCategoryList()
    onAddCancel()
  })
}




function onDelete(id: number) {
  delCategory(id).then(res => {
    if (res.code == 2000) {
      getCategoryList()
      ElNotification.success({title: '删除成功'})
    }
  })
}
</script>
