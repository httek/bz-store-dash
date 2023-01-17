<template>
  <el-page-header class="hide-back p-4">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '账号' }}</b></el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button type="primary" @click="onOp()" icon="Plus" circle />
      </div>
    </template>

    <el-form :inline="true" :model="searchForm" class="mt-5">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item class="w-full" label="名称">
            <el-input v-model="searchForm.name" placeholder="按名称搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full ">
            <el-button :disabled="loading" @click="getItems()" type="primary">搜索</el-button>
            <el-button :disabled="loading" @click="onResetFilter()">重置</el-button>
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
      <el-table-column align="center" fixed="left" width="80" prop="id" label="ID" />
      <el-table-column align="center" fixed="left" prop="name" label="名称" />
      <el-table-column align="center" fixed="left" prop="mobile" label="手机" />
      <el-table-column align="center" prop="type" label="类型">
        <template #default="scope">
          <el-tag disable-transitions>{{
            ['超管', '系统', '商家'][scope.row.type] || ''
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="role.name" label="角色" />
      <el-table-column align="center" width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{
            scope.row.status ? '正常' : '禁用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="170" label="创建时间" />
      <el-table-column align="center" prop="created_at" width="170" label="更新时间" />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button v-if="scope.row.type" link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm v-if="scope.row.type" confirm-button-text="确定" confirm-button-type="danger"
            cancel-button-text="取消" icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)"
            title="确定要是删除吗">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Pagination -->
  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
      v-model:page-size="paginate.size" @size-change="(size) => getItems()" :page-sizes="[10, 20, 30, 50, 100]"
      background layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog size="50%" v-model="opVisible" :title="(opFormModel.id as number) > 0 ? '编辑' : '添加'" align-center
    class="px-5" destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form status-icon ref="opFormRef" :rules="opFormRules" :model="opFormModel" label-width="110px" class="w-full">
      <el-form-item label="图片">
        <el-upload class="w-full" :class="{ 'hide-upload-btn': opFormModel.avatar }" :limit="1"
          :on-success="onFileUploaded" :on-remove="() => opFormModel.avatar = ''"
          accept="image/png,image/jpg,image/jpeg" :file-list="uploadedFiles" :action="UploadApi"
          :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture-card">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="角色">
        <el-tree-select placeholder="账号角色" class="w-full" v-model="opFormModel.role_id" :data="[]" check-strictly />
      </el-form-item>
      <el-form-item label="名称" required prop="name">
        <el-input v-model="opFormModel.name" clearable placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="手机" required>
        <el-input v-model="opFormModel.mobile" placeholder="手机号码，用于登录本系统" maxlength="11" show-word-limit :rows="3" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="opFormModel.password" placeholder="账号密码" minlength="6" maxlength="80" show-word-limit
          :rows="3" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="opFormModel.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onOpCancel()">取消</el-button>
        <el-button :loading="opFormButtonLoading" type="primary" @keydown.enter="onOpSubmit(opFormRef)"
          @click="onOpSubmit(opFormRef)">{{ opFormModel.id ? '保存' : '添加' }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- End Add -->
</template>

<script setup lang="ts">
import { ElNotification, FormInstance, UploadUserFile } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { AdminAPIs } from "../apis/admin.api";
import { Response } from "../bags/response";
import { HTTP, UploadApi } from "../consts";
import { Admin } from "../models/admin";
import { useAuthStore } from "../states/auth.state";

onMounted(() => getItems())

const route = useRoute()
const types = ['快递配送', '商家配送', '其他方式']
const items = ref<Admin[]>([]);
const paginate = reactive({ page: 1, size: 10, total: 0 })
const authStore = useAuthStore()
const loading = ref(false)
const uploadedFiles = ref<UploadUserFile[]>([])
const onFileUploaded = (response: Response) => opFormModel.avatar = (response.data as string)
const getItems = async () => {
  loading.value = true
  const pRes = await AdminAPIs.list(paginate.page, paginate.size, searchForm)
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
  loading.value = false
}

const filterInit = { name: '', status: -1, mobile: '' }
const searchForm = reactive({ ...filterInit })
const onResetFilter = () => {
  Object.assign(searchForm, filterInit)
  getItems()
}

const validateName = (rule: any, value: string, callback: any) => {
  if (value.length < 2) {
    return callback(new Error('名称至少2个字符'))
  }

  callback()
}

const opVisible = ref<boolean>(false)
const opFormRef = ref<FormInstance>()
const opFormButtonLoading = ref(false)
const opFormModelInit: Admin = {
  name: '', id: 0, password: '', mobile: '', role_id: 0, avatar: ''
}
const opFormModel = reactive({ ...opFormModelInit })
const opFormRules = reactive({
  name: [{ validator: validateName, trigger: 'blur' }]
})
const onOp = (row?: Admin) => {
  if (row) {
    Object.assign(opFormModel, row)
    row.avatar && uploadedFiles.value.push({ name: row.avatar as string, url: row.avatar as string })
  }

  opVisible.value = true
}
const onOpCancel = () => {
  Object.assign(opFormModel, opFormModelInit)
  opVisible.value = false
}
const onOpSubmit = (form: FormInstance | undefined) => {
  if (!form) return

  form.validate(async (valid) => {
    if (!valid) {
      return
    }

    opFormButtonLoading.value = true
    let res: Response
    if ((opFormModel.id as number) > 0) {
      res = await AdminAPIs.update(opFormModel.id as number, opFormModel as Admin)
    } else {
      res = await AdminAPIs.store(opFormModel as Admin);
    }

    opFormButtonLoading.value = false
    if (res.code != HTTP.OK) {
      return ElNotification.success({ title: res.msg })
    }

    ElNotification.success({ title: '操作成功' })
    onOpCancel()
    getItems()
  })
}

const onDelete = async (id: number) => {
  const res = await AdminAPIs.destroy(id)
  if (res.code == HTTP.OK) {
    getItems()
    ElNotification.success({ title: '删除成功' })
  }
}
</script>
