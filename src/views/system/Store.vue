<template>
  <div class="container-full w-full p-4">
    <PageHeader add-btn export-btn @on-add="onOp" :path="['系统管理', '店铺管理']">
      <template #default>
        <el-form :inline="true" :model="filterForm" class="my-2 mt-5">
          <el-form-item label="商户">
            <el-input clearable v-model="filterForm.partner" placeholder="按商户名称搜索"/>
          </el-form-item>
          <el-form-item label="店铺">
            <el-input clearable v-model="filterForm.name" placeholder="按店铺名称搜索"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select clearable v-model="filterForm.status" placeholder="状态">
              <el-option label="全部" :value="-1"/>
              <el-option v-for="(name, index) of statusTypes" :label="name" :value="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
                style="width: 240px"
                v-model="filterForm.created_at"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"

            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getLists()">搜索</el-button>
            <el-button @click="onResetFilter()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </PageHeader>

    <el-table style="width: 100% !important;" :border="true" :data="items.data" row-key="id" highlight-current-row
              stripe>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column type="selection" width="55"/>
      <el-table-column fixed="left" width="220" prop="partner" min-width="100" label="商户"/>
      <el-table-column fixed="left" prop="name" width="65" label="店铺">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.name"
                      placement="right">
            <el-avatar shape="square" :size="36" :src="scope.row.logo">{{
                scope.row.name.substring(0, 2)
              }}
            </el-avatar>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'danger' : ''" disable-transitions>
            {{ statusTypes[scope.row.status] || '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="cash_type" label="提现">
        <template #default="scope">
          <el-tag :type="scope.row.cash === 1 ? 'success' : ''" disable-transitions>{{
              scope.row.cash ? '对私' : '对共'
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100" prop="delivery_template" label="配送">
        <template #default="scope">
          <el-tooltip :disabled="!scope.row.delivery_template" class="box-item" effect="dark"
                      :content="scope.row.delivery_template?.tips"
                      placement="right">
            <el-tag>{{ scope.row.delivery_template?.name || '-' }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="deposit" min-width="100" label="保证金(¥)"/>
      <el-table-column prop="aptitude" width="100" label="资质">
        <template #default="scope">
          <el-link v-if="scope.row.aptitude" :href="scope.row.aptitude" target="_blank">查看</el-link>
          <span v-else><small>无</small></span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" width="120" label="电话"/>
      <el-table-column width="100" class="flex justify-center" prop="sequence" label="排序"/>
      <el-table-column prop="created_at" label="创建时间"/>
      <el-table-column prop="created_at" label="更新时间"/>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
                         icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)"
                         :title="'确定要是删除吗?'">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end w-full mt-4" v-if="items.data.length">
      <el-pagination @current-change="(page) => { items.page = page; getLists() }" class="justify-end"
                     v-model:current-page="items.page" v-model:page-size="items.size"
                     :page-sizes="[10, 20, 30, 50, 100]" background
                     layout="total, sizes, prev, pager, next" :total="items.total"/>
    </div>

    <!-- Add -->
    <el-dialog width="700px" v-model="opVisible" :title="opFormModel.id > 0 ? '编辑' : '添加'" align-center class="px-5"
               destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form inline status-icon ref="opFormRef" :rules="opFormRules" :model="opFormModel" label-width="80px"
               class="w-full">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item class="w-full" label="商户名称" required prop="partner">
              <el-input v-model="opFormModel.partner" clearable placeholder="商户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="商户地址" prop="address">
              <el-input v-model="opFormModel.address" maxlength="100" clearable placeholder="商户地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="店铺名称" required prop="name">
              <el-input v-model="opFormModel.name" clearable placeholder="店铺名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" required label="店铺账号" prop="owner_id">
              <el-select
                  class="w-full"
                  v-model="opFormModel.owner_id"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="可按手机号码搜索"
                  remote-show-suffix
                  :remote-method="getAdminLists"
              >
                <el-option
                    v-for="item in admins"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="店铺图标" prop="logo">
              <el-upload
                  :limit="1"
                  :on-success="onFileUploaded"
                  :on-remove="() => opFormModel.logo = ''"
                  accept="image/png,image/jpg,image/jpeg"
                  v-model="opFormModel.logo"
                  :action="UploadApi" :headers="{ Authorization: 'Bearer ' + authStore.token }"
                  list-type="picture"
              >
                <el-icon size="22" v-show="!opFormModel.logo || opFormModel.logo === ''"><FolderOpened /></el-icon>
              </el-upload>
              <el-dialog v-model="previewLogo" :oncancel="() => previewLogo = false">
                <img w-full :src="opFormModel.logo" alt="店铺图标" />
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="w-full" label="店铺图册" prop="photos">
              <el-input v-model="opFormModel.photos" clearable placeholder="店铺图册"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item class="w-full" label="押金额度" prop="deposit">
              <el-input-number class="w-full" placeholder="押金(¥)" v-model="opFormModel.deposit"
                               controls-position="right" :min="0"
                               :precision="2" :step="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="联系电话" prop="phone">
              <el-input v-model="opFormModel.phone" clearable placeholder="商户联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="抽成比例" prop="deduct">
              <el-input-number class="w-full" placeholder="抽成比例" v-model="opFormModel.deduct"
                               controls-position="right" :min="0"
                               :max="1" :precision="2" :step="0.1"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="提现方式" prop="cash">
              <el-select placeholder="提现方式" class="w-full" v-model="opFormModel.cash" clearable>
                <el-option v-for="(name, index) of cashTypes" :label="name" :value="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  class="w-full" label="收款名称" prop="cash_meta">
              <el-input v-model="opFormModel.cash_meta.account_name" clearable placeholder="收款名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  class="w-full" label="收款账号" prop="cash_meta">
              <el-input v-model="opFormModel.cash_meta.account" clearable placeholder="收款账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="开户银行" prop="cash_meta">
              <el-input :disabled="[0, 2].includes(opFormModel.cash)" :value="opFormModel.cash_meta.account_bank" clearable placeholder="开户银行"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="w-full" label="店铺状态" prop="status">
              <el-radio-group v-model="opFormModel.status">
                <el-radio-button v-for="(name, index) of statusTypes" :label="index">{{ name }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="w-full" label="店铺简介">
              <el-input v-model="opFormModel.description" maxlength="200" placeholder="店铺简介,可选" show-word-limit
                        type="textarea"
                        :rows="3"/>
            </el-form-item>
          </el-col>
        </el-row>
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
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {StoreAPIs as APIs} from "../../apis/store.api";
import {AdminAPIs} from "../../apis/admin.api";
import {Paginate, Response} from "../../bags/response";
import {ElNotification, FormInstance } from "element-plus";
import {Delivery} from "../../models/delivery";
import {HTTP, UploadApi} from "../../consts";
import {Store} from "../../models/store";
import {Admin} from "../../models/admin";
import {useAuthStore} from "../../states/auth.state";

onMounted(() => getLists())

const authStore = useAuthStore()
const cashTypes = ['对私打款', '对公转账']
const statusTypes = ['停用', '停业', '开业'] // 0 Blocked 1 Closing 2 Sale
const items = reactive<Paginate>({data: [], total: 0, page: 1, size: 10, lastPage: 1});
const getLists = () => {
  APIs.list(items.page, items.size, filterForm).then(res => Object.assign(items, res.data))
}

const admins = ref<Admin[]>([])
const getAdminLists = async (mobile?: number, init: boolean = false) => {
  if (init) {
    admins.value = (await AdminAPIs.list(1, 999999, {type: 1})).data.data
  } else if (mobile && mobile.toString().length == 11) {
    admins.value = (await AdminAPIs.list(1, 999999, {mobile, type: 1})).data.data
  } else if (init) {
    admins.value = (await AdminAPIs.list(1, 999999, {type: 1})).data.data
  }
}

const filterInit = {
  name: '',
  store_name: '',
  status: -1,
  cash_type: -1,
  cash_meta: {account: '', account_name: '', account_bank: ''},
  address: '',
  owner_id: 0,
  created_at: [],
  delivery_template_id: 0
}
const filterForm = reactive({...filterInit})
const onResetFilter = () => {
  Object.assign(filterForm, filterInit)
  getLists()
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
const opFormModelInit: Store = {id: 0, status: 2, deduct: 0, deposit: 0, cash: 0, cash_meta: {}}
const opFormModel = reactive({...opFormModelInit})
const opFormRules = reactive({
  name: [{validator: validateName, trigger: 'blur'}]
})
const previewLogo = ref<boolean>(false)
const onFileUploaded = (response: Response) => {
  opFormModel.logo = response.data
}
const onOp = (row?: Delivery) => {
  if (row) {
    Object.assign(opFormModel, row)
  }

  opVisible.value = true
  getAdminLists(undefined, true)
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
    if (opFormModel.id > 0) {
      res = await APIs.update(opFormModel.id, opFormModel as Store)
    } else {
      res = await APIs.store(opFormModel as Store);
    }

    opFormButtonLoading.value = false
    if (res.code != HTTP.OK) {
      return ElNotification.success({title: res.msg})
    }

    ElNotification.success({title: '操作成功'})
    onOpCancel()
    getLists()
  })
}

const onDelete = async (id: number) => {
  const res = await APIs.destroy(id)
  if (res.code == HTTP.OK) {
    getLists()
    ElNotification.success({title: '删除成功'})
  }
}
</script>
