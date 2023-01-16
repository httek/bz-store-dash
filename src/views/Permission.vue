<template>
  <el-page-header class="hide-back p-4">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '权限' }}</b></el-breadcrumb-item>
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
          <el-form-item class="mb-2 w-full" label="顶级分类">
            <el-input v-model="searchForm.name" placeholder="按顶级分类名称搜索" />
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
  <el-tree highlight-current class="p-4" :show-checkbox="false" :data="items" node-key="id" default-expand-all
    :expand-on-click-node="false" :props="{ class: () => 'py-1' }">
    <template #default="{ node, data }">
      <el-row :gutter="20" class="w-full p-2">
        <el-col :span="16" class="w-full">
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
        <el-col :span="8" class=" text-right">
          <el-button link @click="onOp(data)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
            icon-color="#626AEF" width="200px" @confirm="onDelete(data.id)"
            :title="data.children ? '确定要删除吗(删除)？' : '确定要是删除吗?'">
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
    </template>
  </el-tree>

  <!-- Add -->
  <el-dialog width="685px" v-model="opPanelVisible" :title="opForm.id as number > 0 ? '编辑' : '添加'" align-center
    class="px-5" destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form inline status-icon :rules="opFormRules" ref="opFormRef" :model="opForm" label-width="80px" class="w-full">
      <el-row :gutter="8">
        <el-col :span="24">
          <el-form-item class="w-full" label="权限类型" prop="status">
            <el-radio-group v-model="opForm.type">
              <el-radio-button :label="0">目录</el-radio-button>
              <el-radio-button :label="1">菜单</el-radio-button>
              <el-radio-button :label="2">操作</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="w-full" label="权限父级" prop="parent_id">
            <el-select @click="getSelectItems" v-model="(opForm.parent_id as number)" clearable placeholder="选择父级"
              class="w-full">
              <template v-for="item in selectItems" :key="item.id">
                <el-option :label="(item.title as string)" :value="(item.id as number)">
                  <span style="float: left">
                    <el-icon v-if="item.icon">
                      <component :is="item.icon"></component>
                    </el-icon> {{ item.title }}
                  </span>
                  <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{
                    item.type == 0 ?
                      '目录' : item.type == 1 ? '菜单' : '操作'
                  }}</span>
                </el-option>
                <template v-for="child in item.children">
                  <el-option :label="(child.title as string)" :value="(child.id as number)">
                    <span class="ml-4" style="float: left">
                      <el-icon v-if="child.icon">
                        <component :is="child.icon"></component>
                      </el-icon> {{ child.title }}
                    </span>
                    <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{
                      child.type == 0 ?
                        '目录' : child.type == 1 ? '菜单' : '操作'
                    }}</span>
                  </el-option>
                  <el-option v-for="cc in child.children" :label="(cc.title as string)" :value="(cc.id as number)">
                    <span class="ml-8" style="float: left">
                      <el-icon v-if="cc.icon">
                        <component :is="cc.icon"></component>
                      </el-icon> {{ cc.title }}
                    </span>
                    <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{
                      cc.type == 0 ?
                        '目录' : cc.type == 1 ? '菜单' : '操作'
                    }}</span>
                  </el-option>
                </template>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="权限名称" required prop="title">
            <el-input v-model="opForm.title" clearable placeholder="名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="权限标识" required prop="slug">
            <el-input v-model="opForm.slug" clearable placeholder="权限标识" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="权限路径" prop="path">
            <el-input v-model="opForm.path" clearable placeholder="权限路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="权限图标" prop="icon">
            <el-input v-model="opForm.icon" clearable placeholder="权限图标" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="前端组件" prop="component">
            <el-input v-model="opForm.component" clearable placeholder="前端组件" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="w-full" label="权限排序" prop="sequence">
            <el-input-number class="w-full" placeholder="排序" v-model="(opForm.sequence as number)"
              controls-position="right" :min="0" :step="1" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item class="w-full" label="状态" prop="status">
            <el-radio-group v-model="(opForm.status as number)">
              <el-radio-button v-for="(name, index) of   statusTypes" :label="index">{{ name }}</el-radio-button>
            </el-radio-group>
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
import { Guide } from '@element-plus/icons-vue';
import { ElMessage, FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PermissionAPIs as APIs } from '../apis/permission.api';
import { Response } from '../bags/response';
import { HTTP } from '../consts';
import { Permission } from "../models/menu";
import { validators } from '../validators';

onMounted(() => getItems())

const loading = ref(false)
const route = useRoute()
const items = ref<Permission[]>([])
const getItems = async () => {
  loading.value = true
  const pRes = await APIs.list(1, 2, searchForm)
  items.value = pRes.data
  loading.value = false
}

const makeSelect = (item: Permission) => {
  if (item.type == 2) {
    return null
  }

  const childrens = item.children?.map(makeSelect).filter(item => item != null)
  item.children = childrens as Permission[]
  return item;
}

const selectItems = ref<Permission[]>([])
const getSelectItems = async () => {
  const pRes = await APIs.list(1, 1, searchForm)
  selectItems.value = pRes.data.map(makeSelect)
}

const statusTypes = ['禁用', '正常']
const searchFormInit = { name: '', status: -1 }
const searchForm = reactive({ ...searchFormInit })
const opFormInit = { id: 0, title: '', icon: '', status: 1, type: 2, path: '', slug: '', sequence: 0, parent_id: undefined, component: '' }
const opFormRef = ref<FormInstance>()
const opForm = reactive<Permission>({ ...opFormInit })
const opFormRules = reactive({
  name: [{ asyncValidator: validators.nameRequiredWithMin2Len, trigger: 'blur' }]
})
const opFormButtonLoading = ref<boolean>(false)
const opPanelVisible = ref<boolean>(false)
const onOp = (row?: Permission) => {
  if (row) {
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
    if ((opForm.id || 0) > 0) {
      res = await APIs.update((opForm.id || 0), opForm as Permission)
    } else {
      res = await APIs.store(opForm as Permission);
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
}


const onDelete = async (id: number) => {
  const dRes = await APIs.destroy(id)
  if (dRes.code == HTTP.OK) {
    ElMessage.success('删除成功')
    await getItems()
  }
}
</script>