<template>
  <el-page-header class="hide-back p-4">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '角色' }}</b></el-breadcrumb-item>
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
          <el-form-item class="mb-2" label="状态">
            <el-select v-model="searchForm.status">
              <el-option :value="-1" label="全部" />
              <el-option v-for="(name, index) of statusTypes" :value="index" :label="name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="mb-2">
            <el-button @click="getItems()" type="primary">搜索</el-button>
            <el-button @click="Object.assign(searchForm, searchFormInit); getItems()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-page-header>

  <el-table class="p-4" :border="true" :data="items" row-key="id" highlight-current-row stripe>
    <template #empty>
      <el-empty description="暂无数据"></el-empty>
    </template>
    <el-table-column align="center" fixed="left" width="60" prop="id" label="ID" />
    <el-table-column align="center" fixed="left" min-width="120" prop="name" label="名称" />
    <el-table-column align="center" width="70" prop="status" label="状态">
      <template #default="scope">
        <el-tag :type='(statusTagColor[scope.row.status] as any)' disable-transitions>{{
          statusTypes[scope.row.status] ||
            '-'
        }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="left" min-width="200" prop="description" label="描述" />
    <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
    <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
    <el-table-column align="center" fixed="right" label="操作" width="160">
      <template #default="scope">
        <el-button link @click="onEditPermission(scope.row.id)" class="hover:text-blue-500">权限</el-button>
        <el-divider direction="vertical" />
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

  <div class="flex justify-end w-full p-4" v-if="items.length">
    <el-pagination @current-change="(page) => { paginate.page = page; getItems() }" class="justify-end"
      :page-sizes="[10, 20, 30, 50, 100]" background @size-change="onPageSizeChange"
      layout="total, sizes, prev, pager, next" :total="paginate.total" />
  </div>

  <!-- Add -->
  <el-dialog width="685px" v-model="opPanelVisible" :title="opModel.id > 0 ? '编辑' : '添加'" align-center class="px-5"
    destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form inline status-icon ref="opFormRef" :rules="opFormRules" :model="opModel" label-width="80px" class="w-full">
      <el-row :gutter="8">
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
        <el-col :span="24">
          <el-form-item class="w-full" label="描述" prop="description">
            <el-input :rows="3" type="textarea" v-model="opModel.description" maxlength="200" show-word-limit clearable
              placeholder="描述" />
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

  <!-- Permissions -->
  <el-drawer size="50%" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"
    v-model="editPermissionPanelVisible" :title="item.name + ' · 权限配置'">
    <template #default>
      <el-descriptions :column="2" border>
        <el-descriptions-item width="80px" label-align="right" label="角色名称">{{ item.name }}</el-descriptions-item>
        <el-descriptions-item width="80px" label-align="right" label="角色描述">{{
          item.description
        }}</el-descriptions-item>
        <el-descriptions-item width="80px" label-align="right" label="创建时间">{{
          item.created_at
        }}</el-descriptions-item>
        <el-descriptions-item width="80px" label-align="right" label="更新时间">{{
          item.updated_at
        }}</el-descriptions-item>
        <el-descriptions-item width="80px" label-align="right" :span="1" label="角色权限">
          <el-tree ref="permissionTreeRef" show-checkbox highlight-current :data="permissons" node-key="id"
            default-expand-all :default-checked-keys="(item.permissionIds as [])">
            <template #default="{ node, data }">
              <el-row :gutter="20" class="w-full p-2">
                <el-col :span="24" class="w-full">
                  <el-icon v-if="data.icon" class="mr-1">
                    <component :is="data.icon"></component>
                  </el-icon> {{ data.title }}
                  <small>[{{ data.type == 0 ? '目录' : data.type == 1 ? '菜单' : '操作' }}]</small>
                  <el-link class="ml-4" v-if="data.type == 1" :href="data.path" target="_blank">
                    <small>{{
                      data.path
                    }}</small>
                  </el-link>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </el-descriptions-item>
      </el-descriptions>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCancelEditPermissionPanel()">取消</el-button>
        <el-button @click="onEditPermissionSubmit(item.id)" :disabled="permissionPanelLoading"
          :loading="permissionPanelLoading" type="primary">保存</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- End Permissions -->
</template>

<script setup lang="ts">
import { ElMessage, ElTree, FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PermissionAPIs } from '../apis/permission.api';
import { RoleAPIs as APIs } from '../apis/role.api';
import { Response } from '../bags/response';
import { HTTP } from '../consts';
import { Permission } from '../models/menu';
import { Role as Model } from '../models/role';

onMounted(() => getItems())

const route = useRoute()
const opFormRef = ref<FormInstance>()
const opFormButtonLoading = ref<boolean>(false)

const statusTypes = ['禁用', '正常']
const statusTagColor = ["danger", ""]

const loading = ref<boolean>(false)
const searchFormInit = { status: -1, name: '' }
const searchForm = reactive({ ...searchFormInit })
const paginate = reactive({ page: 1, size: 10, total: 0 })
const onPageSizeChange = (size: number) => {
  paginate.size = size; getItems()
}
const items = ref<Model[]>([])
const getItems = async () => {
  loading.value = true
  const pRes = await APIs.list(paginate.page, paginate.size, searchForm as Model)
  loading.value = false
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
}

const opModelInit = { id: 0, status: 1, title: '', name: '' }
const opPanelVisible = ref<boolean>(false)
const opModel = reactive<Model>({ ...opModelInit })

// Edit Permission
const item = ref<Model>({} as Model)
const permissons = ref<Permission[]>([])
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()
const permissionPanelLoading = ref<boolean>(false)
const editPermissionPanelVisible = ref<boolean>(false)
const onCancelEditPermissionPanel = () => {
  editPermissionPanelVisible.value = false
  permissons.value = []
  item.value = { permissionIds: undefined } as Model
}
const onEditPermission = async (id: number) => {
  permissionPanelLoading.value = true
  const showRes = await APIs.show(id)
  const pRes = await PermissionAPIs.list(1, 1)
  item.value = showRes.data
  permissons.value = pRes.data
  editPermissionPanelVisible.value = true
  permissionPanelLoading.value = false
}
const onEditPermissionSubmit = async (id: number) => {
  permissionPanelLoading.value = true
  const permissions = permissionTreeRef.value!.getCheckedKeys(false) as []
  const paRes = await APIs.attachPermissions(id, permissions)
  permissionPanelLoading.value = false
  if (paRes.code == HTTP.OK) {
    ElMessage.success(paRes.msg)
    getItems()
    onCancelEditPermissionPanel()
  }
}

const preciseName = async (rule: any, value: string, callback: any) => {
  if (value.length < 2) {
    return callback(new Error('名称至少2个字符'))
  }

  if (opModel.id == 0 || opModel.id > 0 && value != opModel.name) {
    const pRes = await APIs.precise(value)
    if (pRes.data) {
      return callback(new Error('该角色名称已存在'))
    }
  }

  callback()
}
const opFormRules = reactive({
  name: [{
    asyncValidator: preciseName, trigger: 'blur'
  }]
})

const onOp = (row?: Model) => {
  if (row) Object.assign(opModel, row)
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