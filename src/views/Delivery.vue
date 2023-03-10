<template>
  <el-page-header class="hide-back p-4">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '配送' }}</b></el-breadcrumb-item>
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
          <el-form-item class="w-full" label="类型">
            <el-select class="w-full" v-model="searchForm.type" placeholder="请选择类型">
              <el-option label="全部" :value="-1" />
              <el-option v-for="(name, index) of types" :label="name" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
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
      <el-table-column align="center" fixed="left" prop="name" label="名称">
        <template #default="scope">
          <el-tooltip :disabled="!scope.row.tips" class="box-item" effect="dark" :content="scope.row.tips"
            placement="right">
            {{ scope.row.name }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template #default="scope">
          <el-tag disable-transitions>{{ types[scope.row.type] || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="cost" label="费用">
        <template #default="scope">
          ¥ {{ scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? '' : 'danger'" disable-transitions>{{
            scope.row.status ? '正常' : '禁用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" class="flex justify-center" prop="sequence" label="排序" />
      <el-table-column align="center" prop="created_at" label="创建时间" />
      <el-table-column align="center" prop="created_at" label="更新时间" />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
            icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)"
            :title="scope.row.level <= 2 ? '确定要删除吗(所属子分类也会被删除)?' : '确定要是删除吗?'">
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
  <el-dialog v-model="opVisible" :title="opFormModel.id > 0 ? '编辑' : '添加'" width="600px" align-center class="px-5"
    destroy-on-close :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form status-icon ref="opFormRef" :rules="opFormRules" :model="opFormModel" label-width="80px" class="w-full">
      <el-form-item label="类型" required prop="type">
        <el-select class="w-full" v-model="opFormModel.type" clearable required>
          <el-option v-for="(name, index) of types" :label="name" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" required prop="name">
        <el-input v-model="opFormModel.name" clearable placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="费用">
        <el-col :span="10">
          <el-form-item>
            <el-input-number v-model="opFormModel.cost" :precision="2" :step="0.5" />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="4">
          <span class="text-gray-500">排序</span>
        </el-col>
        <el-col :span="10">
          <el-input-number v-model="opFormModel.sequence" :min="0" />
        </el-col>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="opFormModel.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提示">
        <el-input v-model="opFormModel.tips" maxlength="200" placeholder="提示用户注意事项，可选" show-word-limit type="textarea"
          :rows="5" />
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
import { ElNotification, FormInstance } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { DeliveryAPIs } from "../apis/delivery.api";
import { Response } from "../bags/response";
import { HTTP } from "../consts";
import { Delivery } from "../models/delivery";

onMounted(() => getItems())

const route = useRoute()
const types = ['快递配送', '商家配送', '其他方式']
const items = ref<Delivery[]>([]);
const paginate = reactive({ page: 1, size: 10, total: 0 })
const loading = ref(false)
const getItems = async () => {
  loading.value = true
  const pRes = await DeliveryAPIs.list(paginate.page, paginate.size, searchForm)
  items.value = pRes.data.data
  paginate.page = pRes.data.page
  paginate.size = pRes.data.size
  paginate.total = pRes.data.total
  loading.value = false
}

const filterInit = { name: '', type: -1 }
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
const opFormModelInit = { type: 0, name: '', meta: null, sequence: 0, status: 1, id: 0, cost: 0, tips: '' }
const opFormModel = reactive({ ...opFormModelInit })
const opFormRules = reactive({
  name: [{ validator: validateName, trigger: 'blur' }]
})
const onOp = (row?: Delivery) => {
  if (row) {
    Object.assign(opFormModel, row)
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
    if (opFormModel.id > 0) {
      res = await DeliveryAPIs.update(opFormModel.id, opFormModel as Delivery)
    } else {
      res = await DeliveryAPIs.store(opFormModel as Delivery);
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
  const res = await DeliveryAPIs.destroy(id)
  if (res.code == HTTP.OK) {
    getItems()
    ElNotification.success({ title: '删除成功' })
  }
}
</script>
