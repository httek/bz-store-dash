<template>
  <el-page-header class="hide-back p-4">
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
        <el-button v-if="authStore.hasPermission('store.add')" type="primary" @click="onOp()" icon="Plus" circle />
      </div>
    </template>

    <el-form :inline="true" :model="searchForm" class="mt-5">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item class="w-full" label="商户名称">
            <el-input clearable v-model="searchForm.partner" placeholder="按商户名称搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="店铺名称">
            <el-input clearable v-model="searchForm.name" placeholder="按店铺名称搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="店铺账号" prop="owner_id">
            <el-select class="w-full" @focus="getAdminLists" v-model="searchForm.owner_id" filterable remote
              reserve-keyword remote-show-suffix clearable placeholder="按店铺账号搜索">
              <el-option v-for="item in admins" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="店铺状态">
            <el-select class="w-full" clearable v-model="searchForm.status" placeholder="状态">
              <el-option label="全部" :value="-1" />
              <el-option v-for="(name, index) of statusTypes" :label="name" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full" label="创建时间">
            <el-date-picker style="width: 240px" v-model="(searchForm.created_at as any)" value-format="YYYY-MM-DD"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w-full">
            <el-button :disabled="loading" type="primary" @click="getLists()">搜索</el-button>
            <el-button :disabled="loading" @click="onResetFilter()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>

  <div class="mx-4">
    <el-table :border="true" :data="items" row-key="id" highlight-current-row stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" fixed="left" min-width="120" prop="name" label="店铺名称" />
      <el-table-column align="center" fixed="left" min-width="120" prop="owner.mobile" label="店铺账号" />
      <el-table-column align="center" prop="name" width="100" label="店铺Logo">
        <template #default="scope">
          <el-avatar class="cover" shape="square" :size="36" :src="scope.row.cover">{{ scope.row.name.substring(0, 2) }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="status" label="店铺状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'danger' : ''" disable-transitions>
            {{ statusTypes[scope.row.status] || '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="cash_type" label="提现方式">
        <template #default="scope">
          <el-tag :type="scope.row.cash === 1 ? 'success' : ''" disable-transitions>{{
            scope.row.cash ? '对私' : '对共'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deposit" min-width="100" label="保证金(¥)" />
      <el-table-column align="center" prop="phone" width="130" label="电话" />
      <el-table-column align="center" width="100" class="flex justify-center" prop="sequence" label="排序" />
      <el-table-column align="center" prop="expired_at" min-width="180" label="服务截止" />
      <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button v-if="authStore.hasPermission('store.edit')" link @click="onOp(scope.row)"
            class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm v-if="authStore.hasPermission('store.delete')" confirm-button-text="确定"
            confirm-button-type="danger" cancel-button-text="取消" icon-color="#626AEF" width="200px"
            @confirm="onDelete(scope.row.id)" :title="'确定要是删除吗?'">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; getLists() }" class="justify-end"
      v-model:current-page="paginate.page" @size-change="(size) => { paginate.size = size; getLists() }"
      v-model:page-size="paginate.size" background layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog width="685px" v-model="opVisible" :title="opForm.id > 0 ? '编辑' : '添加'" align-center class="px-5"
    destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form inline status-icon ref="opFormRef" :rules="opFormRules" :model="opForm" label-width="80px" class="w-full">
      <el-row :gutter="8">
        <el-col :span="24">
          <el-form-item class="w-full" required label="店铺图标" prop="cover">
            <el-upload class="w-full" :class="{ 'hide-upload-btn': opForm.cover }" :limit="1"
              :on-success="onFileUploaded" :on-remove="() => opForm.cover = ''" accept="image/png,image/jpg,image/jpeg"
              :file-list="uploadedFiles" :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }"
              list-type="picture-card">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
            <el-dialog v-model="previewLogo" :oncancel="() => previewLogo = false">
              <img w-full :src="opForm.cover || ''" alt="店铺图标" />
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商户名称" required prop="partner">
            <el-input clearable v-model="opForm.partner" placeholder="商户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="商户地址" prop="address">
            <el-input v-model="opForm.address" maxlength="100" clearable placeholder="商户地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="店铺名称" required prop="name">
            <el-input v-model="opForm.name" clearable placeholder="店铺名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" required label="店铺账号" prop="owner_id">
            <el-select class="w-full" v-model="opForm.owner_id" filterable remote reserve-keyword clearable
              placeholder="可按账号名称搜索" remote-show-suffix @focus="getAdminLists">
              <el-option v-for="item in admins" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="押金额度" prop="deposit">
            <el-input-number class="w-full" placeholder="押金(¥)" v-model="opForm.deposit" controls-position="right"
              :min="0" :precision="2" :step="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="服务截止" prop="expired_at">
            <el-date-picker clearable lang="zhCn" value-format="YYYY-MM-DD HH:mm:ss"
              v-model="(opForm.expired_at as string)" type="datetime" placeholder="服务截止日前" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="联系电话" prop="phone">
            <el-input v-model="opForm.phone" clearable placeholder="商户联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="抽成比例" prop="deduct">
            <el-input-number class="w-full" placeholder="抽成比例" v-model="opForm.deduct" controls-position="right"
              :min="0" :max="1" :precision="2" :step="0.1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="提现方式" prop="cash">
            <el-select placeholder="提现方式" class="w-full" v-model="opForm.cash" clearable>
              <el-option v-for="(name, index) of cashTypes" :label="name" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="收款名称" prop="cash_meta">
            <el-input v-model="opForm.cash_meta.account_name" clearable placeholder="收款名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="收款账号" prop="cash_meta">
            <el-input v-model="opForm.cash_meta.account" clearable placeholder="收款账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="开户银行" prop="cash_meta">
            <el-input :disabled="opForm.cash === 0" v-model="opForm.cash_meta.account_bank" clearable
              placeholder="开户银行" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="店铺状态" prop="status">
            <el-radio-group v-model="opForm.status">
              <el-radio-button v-for="(name, index) of statusTypes" :label="index">{{
                name
              }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="店铺简介">
            <el-input v-model="opForm.description" maxlength="200" placeholder="店铺简介,可选" show-word-limit type="textarea"
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
  <!-- End Add -->
</template>

<script setup lang="ts">
import { ElNotification, FormInstance, UploadUserFile } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { AdminAPIs } from "../apis/admin.api";
import { StoreAPIs as APIs } from "../apis/store.api";
import { Response } from "../bags/response";
import { Admin as AdminConst, HTTP, UploadApi } from "../consts";
import { Admin } from "../models/admin";
import { Store } from "../models/store";
import { useAuthStore } from "../states/auth.state";

onMounted(() => getLists())
const route = useRoute()
const authStore = useAuthStore()
const cashTypes = ['对私打款', '对公转账']
const statusTypes = ['停用', '停业', '开业'] // 0 Blocked 1 Closing 2 Sale
const items = ref<Store[]>([]);
const paginate = reactive({ page: 1, size: 10, total: 0 })
const loading = ref(false)
const getLists = async () => {
  loading.value = true
  const pRes = await APIs.list(paginate.page, paginate.size, searchForm);
  items.value = pRes.data.data
  paginate.size = pRes.data.size
  paginate.page = pRes.data.page
  paginate.total = pRes.data.total
  loading.value = false
}

const admins = ref<Admin[]>([])
const getAdminLists = async (mobile?: number, init: boolean = false) => {
  admins.value = (await AdminAPIs.select(AdminConst.AdminType.StoreOwner)).data
}

const filterInit = {
  name: '',
  partner: '',
  status: -1,
  cash: -1,
  owner_id: undefined,
  created_at: [],
}
const searchForm = reactive({ ...filterInit })
const onResetFilter = () => {
  Object.assign(searchForm, filterInit)
  getLists()
}

const validateName = async (rule: any, value: string, callback: any) => {

  if (!value || value.length < 2) {
    return callback(new Error('名称至少2个字符'))
  }

  if (opForm.id <= 0) {
    const res = await APIs.precisSearch({ key: 'name', value })
    if (res.data && (res.data.id || 0)) {
      return callback(new Error('该店铺名称已被占用'))
    }
  }

  callback()
}
const validatePartner = (rule: any, value: string, callback: any) => {
  if (!value || value.length < 2) {
    return callback(new Error('名称至少2个字符'))
  }

  callback()
}

const opVisible = ref<boolean>(false)
const opFormRef = ref<FormInstance>()
const opFormButtonLoading = ref(false)
const opFormInit: Store = {
  id: 0,
  name: '',
  owner_id: undefined,
  partner: '',
  address: '',
  phone: undefined,
  status: 2,
  photos: null,
  deduct: 0,
  deposit: 0,
  cash: 0,
  cash_meta: { account: null, account_name: '', account_bank: '' },
  expired_at: '',
  description: ''
}
const opForm = reactive({ ...opFormInit })
const opFormRules = reactive({
  partner: [{ validator: validatePartner, trigger: 'blur' }],
  name: [{ asyncValidator: validateName, trigger: 'blur' }]
})
const previewLogo = ref<boolean>(false)
const onFileUploaded = (response: Response) => {
  opForm.cover = response.data
}
const onOp = (row?: Store) => {
  if (row) {
    Object.assign(opForm, row)
    if (row.cover) {
      uploadedFiles.value = [{ name: row.cover, url: row.cover }]
    }
  }

  opVisible.value = true
  getAdminLists(undefined, true)
}
const onOpCancel = () => {
  Object.assign(opForm, opFormInit)
  opVisible.value = false
  uploadedFiles.value.length = 0
  opForm.cover = null
}

const onOpSubmit = (form: FormInstance | undefined) => {
  if (!form) return

  form.validate(async (valid) => {
    if (!valid) {
      return
    }

    opFormButtonLoading.value = true
    if (!opForm.expired_at) {
      opForm.expired_at = null
    }

    let res: Response
    if (opForm.id > 0) {
      res = await APIs.update(opForm.id, opForm as Store)
    } else {
      res = await APIs.store(opForm as Store);
    }

    opFormButtonLoading.value = false
    if (res.code == HTTP.OK) {
      ElNotification.success({ title: '操作成功' })
      onOpCancel()
      getLists()
    }
  })
}

const onDelete = async (id: number) => {
  const res = await APIs.destroy(id)
  if (res.code == HTTP.OK) {
    getLists()
    ElNotification.success({ title: '删除成功' })
  }
}

const uploadedFiles = ref<UploadUserFile[]>([])
</script>
