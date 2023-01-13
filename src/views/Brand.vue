<template>
  <el-page-header class="hide-back p-4 bg-slate-50">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '品牌' }}</b></el-breadcrumb-item>
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
          <el-form-item class="mb-2" label="名称">
            <el-input v-model="searchForm.name" placeholder="按名称搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="mb-2" label="名称">
            <el-select v-model="searchForm.status">
              <el-option :value="-1" label="全部" />
              <el-option v-for="(name, index) of statusTypes" :value="index" :label="name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full mb-2">
            <el-button :disabled="loading" @click="getItems()" type="primary">搜索</el-button>
            <el-button :disabled="loading" @click="Object.assign(searchForm, searchFormInit); getItems()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>

  <el-table class="p-4" style="width: 100% !important;" :border="true" :data="items" row-key="id" highlight-current-row
    stripe>
    <template #empty>
      <el-empty description="暂无数据"></el-empty>
    </template>

    <el-table-column align="center" fixed="left" prop="id" width="80" label="ID" />
    <el-table-column align="left" fixed="left" width="220" prop="cover" label="名称">
      <template #default="scope">
        <el-avatar class="cover" shape="square" :size="36" :src="scope.row.cover">{{ scope.row.name.substring(0, 2) }}
        </el-avatar>
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column align="center" width="100" prop="status" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{
          scope.row.status ? '正常' : '禁用'
        }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="site" label="官网">
      <template #default="scope">
        <el-link v-if="scope.row.site" :href="scope.row.site" type="primary" target="_blank">
          查看
          <el-icon class="ml-1">
            <Link />
          </el-icon>
        </el-link>
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

  <!-- Pagination -->
  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
      v-model:page-size="paginate.size" @size-change="(size) => getItems()" :page-sizes="[10, 20, 30, 50, 100]"
      background layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog width="685px" v-model="opPanelVisible" :title="opForm.id > 0 ? '编辑' : '添加'" align-center class="px-5"
    destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form inline status-icon :rules="opFormRules" ref="opFormRef" :model="opForm" label-width="80px" class="w-full">
      <el-row :gutter="8">
        <el-col :span="24">
          <el-form-item class="w-full" label="图标" prop="logo">
            <el-upload class="w-full" :class="{ 'hide-upload-btn': opForm.cover }" :limit="1"
              :on-success="onFileUploaded" :on-remove="() => opForm.cover = ''" accept="image/png,image/jpg,image/jpeg"
              :file-list="uploadedFiles" :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }"
              list-type="picture-card">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="名称" required prop="name">
            <el-input v-model="opForm.name" clearable placeholder="名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="官网" prop="site">
            <el-input v-model="opForm.site" clearable placeholder="官网" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="排序" prop="sequence">
            <el-input-number class="w-full" placeholder="排序" v-model="opForm.sequence" controls-position="right"
              :min="0" :step="1" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="状态" prop="status">
            <el-radio-group v-model="opForm.status">
              <el-radio-button v-for="(name, index) of statusTypes" :label="index">{{ name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="简介">
            <el-input v-model="opForm.description" maxlength="200" placeholder="品牌简介,可选" show-word-limit type="textarea"
              :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onOpCancel()">取消</el-button>
        <el-button :loading="opFormButtonLoading" type="primary" @keydown.enter="onOpSubmit(opFormRef)"
          @click="onOpSubmit(opFormRef)">{{ opForm.id ? '保存' : '添加' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, UploadUserFile } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BrandAPIs as APIs } from '../apis/brand.api';
import { Response } from '../bags/response';
import { HTTP, UploadApi } from '../consts';
import { Brand } from '../models/brand';
import { useAuthStore } from '../states/auth.state';
import { validators } from '../validators';

onMounted(() => getItems())

const loading = ref(false)
const route = useRoute()
const authStore = useAuthStore()
const items = ref<Brand[]>([])
const paginate = reactive<{ page: number, size: number, total: number }>({ page: 1, size: 10, total: 0 })
const getItems = async () => {
  loading.value = true
  const pRes = await APIs.list(paginate.page, paginate.size, searchForm)
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
  items.value = pRes.data.data
  loading.value = false
}

const statusTypes = ['禁用', '正常']
const searchFormInit = { name: '', status: -1 }
const searchForm = reactive({ ...searchFormInit })
const opFormInit = { id: 0, name: '', cover: '', status: 1, description: '', site: '', sequence: 0, category_id: 0 }
const opFormRef = ref<FormInstance>()
const opForm = reactive<Brand>({ ...opFormInit })
const opFormRules = reactive({
  name: [{ asyncValidator: validators.nameRequiredWithMin2Len, trigger: 'blur' }]
})
const opFormButtonLoading = ref<boolean>(false)
const opPanelVisible = ref<boolean>(false)
const uploadedFiles = ref<UploadUserFile[]>([])
const onFileUploaded = (res: Response) => {
  if (res.code == HTTP.OK) {
    opForm.cover = res.data
  } else {
    ElMessage.error(res.msg || '图片上传失败')
  }
}
const onOp = (row?: Brand) => {
  if (row) {
    if (row.cover) {
      uploadedFiles.value.length = 0
      uploadedFiles.value.push({ name: row.cover, url: row.cover })
    }

    Object.assign(opForm, row)
  }

  opPanelVisible.value = true
}

const onOpSubmit = (form: FormInstance | undefined) => {
  if (!form) return

  form.validate(async (valid) => {
    if (!valid) {
      return
    }

    opFormButtonLoading.value = true
    let res: Response
    if (opForm.id > 0) {
      res = await APIs.update(opForm.id, opForm as Brand)
    } else {
      res = await APIs.store(opForm as Brand);
    }

    opFormButtonLoading.value = false
    if (res.code == HTTP.OK) {
      ElMessage.success('操作成功')
      onOpCancel()
      getItems()
    }
  })
}
const onOpCancel = () => {
  Object.assign(opForm, opFormInit)
  opPanelVisible.value = false
  uploadedFiles.value.length = 0
}


const onDelete = async (id: number) => {
  const dRes = await APIs.destroy(id)
  if (dRes.code == HTTP.OK) {
    ElMessage.success('删除成功')
    await getItems()
  }
}

</script>