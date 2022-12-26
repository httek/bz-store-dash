<template>
  <div class="container-full w-full p-4">
    <PageHeader add-btn @on-add="onAddVisible" :path="['系统管理', `分类列表`]">
      <template #default>
        <el-form :inline="true" :model="searchFormModel" class="my-2 mt-5">
          <el-form-item label="类型">
            <el-select v-model="searchFormModel.type" placeholder="请选择类型">
              <el-option label="商品分类" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="searchFormModel.name" placeholder="按名称搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadCategories">搜索</el-button>
            <el-button @click="onResetSearchForm">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </PageHeader>
    <!-- Data view -->
    <el-table :border="true" stripe :data="items" row-key="id" :default-expand-all="true"
      highlight-current-row table-layout="auto">
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column prop="name" label="名称" />
      <el-table-column width="80" prop="cover" label="图标">
        <template #default="scope">
          <el-image v-if="scope.row.cover" class="rounded" style="height: 28px" :preview-src-list="[scope.row.cover]"
            :src="scope.row.cover" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{ scope.row.status ? '正常' : '禁用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" class="flex justify-center" prop="sequence" label="排序" />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="created_at" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="120">
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
    <!-- Add -->
    <el-dialog v-model="addDialogVisible" :title="addFormModel.id > 0 ? '编辑分类' : '添加分类'" width="600px" align-center
      class="px-5" destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form status-icon ref="addFormRef" :rules="addFormRules" :model="addFormModel" label-width="80px"
        class="w-full">
        <el-form-item label="父级">
          <el-tree-select placeholder="父级分类，可选" class="w-full" v-model="addFormModel.parent" :data="categoriesSelector"
            check-strictly :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="名称" required prop="name">
          <el-input v-model="addFormModel.name" clearable placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="封面">
          <el-upload accept="image/png,image/jpg,image/jpeg" class="w-full" v-model="addFormModel.cover"
            :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture" :limit="1"
            :on-success="onFileUploaded" :on-remove="() => addFormModel.cover = ''">
            <el-icon size="24" class="mr-4 text-blue-500">
              <UploadFilled />
            </el-icon>
            选择文件
          </el-upload>
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
    <!-- End Add -->
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Category as CategoryModel } from "../../models/category";
import { CategoryAPIs } from "../../apis/category.api";
import { HTTP, UploadApi } from "../../consts";
import { useAuthStore } from "../../states/auth.state";
import { Response } from "../../bags/response";
import type { FormInstance } from "element-plus";
import { validators } from "../../validators/index";
import { ElNotification } from "element-plus";
import PageHeader from "../../components/PageHeader.vue";

export interface treeNode {
  value: number
  label: string
  disabled: boolean
  children?: treeNode[] | null
}

onMounted(() => loadCategories())
const authStore = useAuthStore()
const items = ref<CategoryModel[]>([])
// Search
const searchFormInit = { name: '', type: 0 }
const searchFormModel = reactive({ ...searchFormInit })
const loadCategories = async () => items.value = (await CategoryAPIs.list(searchFormModel)).data
const onResetSearchForm = () => {
  Object.assign(searchFormModel, searchFormInit)
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
const addFormModelInit = { parent: null, name: '', cover: '', sequence: 0, status: 1, id: 0 }
const addFormModel = reactive({ ...addFormModelInit })
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<any>({
  name: [{ validator: validators.nameRequiredWithMin2Len, trigger: 'blur' }]
})
const onFileUploaded = (response: Response) => addFormModel.cover = (response.data as string)
const onAddVisible = async (row?: CategoryModel) => {
  const cateRes = (await CategoryAPIs.selector()).data
  for (const cate of cateRes) {
    categoriesSelector.push(makeTreeNode(cate, row?.id))
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
