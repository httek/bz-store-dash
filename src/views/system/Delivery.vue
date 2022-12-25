<template>
  <div class="container-full w-full p-4">
    <PageHeader
        add-btn @on-add="onOp" :path="['系统管理', '配送模版']">
      <template #default>
        <el-form :inline="true" :model="filterForm" class="my-2 mt-5">
          <el-form-item label="类型">
            <el-select v-model="filterForm.type" placeholder="请选择类型">
              <el-option label="全部" :value="-1"/>
              <el-option v-for="(name, index) of types" :label="name" :value="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="filterForm.name" placeholder="按名称搜索"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDeliveryList()">搜索</el-button>
            <el-button @click="onResetFilter()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </PageHeader>
    <el-empty v-if="!items.data.length" class="mt-36" description="暂无数据."/>
    <el-table
        border
        stripe
        v-if="items.data.length"
        :data="items.data"
        row-key="id"
        highlight-current-row
        table-layout="auto"
    >
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="名称">
        <template #default="scope">
          <el-tooltip
              :disabled="!scope.row.tips"
              class="box-item"
              effect="dark"
              :content="scope.row.tips"
              placement="right"
          >
            {{ scope.row.name }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag>{{ types[scope.row.type] || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="cost" label="费用">
        <template #default="scope">
          ¥ {{ scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column width="80" prop="status" label="状态">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 1 ? '' : 'danger'"
              disable-transitions
          >{{ scope.row.status ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" class="flex justify-center" prop="sequence" label="排序"/>
      <el-table-column prop="created_at" label="创建时间"/>
      <el-table-column prop="created_at" label="更新时间"/>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link @click="onOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
          <el-popconfirm
              confirm-button-text="确定"
              confirm-button-type="danger"
              cancel-button-text="取消"
              icon-color="#626AEF"
              width="200px"
              @confirm="onDelete(scope.row.id)"
              :title="scope.row.level <= 2 ? '确定要删除吗(所属子分类也会被删除)?' : '确定要是删除吗?'"
          >
            <template #reference>
              <el-button link class="hover:text-red-500">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end w-full mt-4" v-if="items.data.length">
      <el-pagination
          @current-change="(page) => {items.page = page; getDeliveryList()}"
          class="justify-end"
          v-model:current-page="items.page"
          v-model:page-size="items.size"
          :page-sizes="[10, 20, 30, 50, 100]"
          background
          layout="total, sizes, prev, pager, next"
          :total="items.total"
      />
    </div>

    <!-- Add -->
    <el-dialog
        v-model="opVisible"
        :title="opFormModel.id > 0 ? '编辑' : '添加'"
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
          ref="opFormRef"
          :rules="opFormRules"
          :model="opFormModel" label-width="80px" class="w-full">
        <el-form-item label="类型" required prop="type">
          <el-select class="w-full"  v-model="opFormModel.type" clearable required>
            <el-option v-for="(name, index) of types" :label="name" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" required prop="name">
          <el-input v-model="opFormModel.name" clearable placeholder="请输入名称"/>
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
            <el-input-number v-model="opFormModel.sequence" :min="0"/>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="opFormModel.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示">
          <el-input
              v-model="opFormModel.tips"
              maxlength="200"
              placeholder="提示用户注意事项，可选"
              show-word-limit
              type="textarea"
              :rows="5"
          />
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
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {getDeliveries, postDelivery, destroyDelivery, updateDelivery} from "../../apis/delivery.api";
import {Paginate, Response} from "../../bags/response";
import {ElNotification, FormInstance} from "element-plus";
import {Delivery} from "../../models/delivery";
import {delCategory} from "../../apis/category.api";

onMounted(() => getDeliveryList())

const types = ['快递配送', '商家配送', '其他方式']
const items = reactive<Paginate>({data: [], total: 0, page: 1, size: 10, lastPage: 1});
const getDeliveryList = () => {
  getDeliveries(items.page, items.size, filterForm).then(res => Object.assign(items, res.data))
}


const filterInit = {name: '', type: -1}
const filterForm = reactive({...filterInit})
const onResetFilter = () => {
  Object.assign(filterForm, filterInit)
  getDeliveryList()
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
const opFormModelInit = {type: 0, name: '', meta: null, sequence: 0, status: 1, id: 0, cost: 0, tips: ''}
const opFormModel = reactive({...opFormModelInit})
const opFormRules = reactive({
  name: [{validator: validateName, trigger: 'blur'}]
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
    if (opFormModel.id > 0) {
      await updateDelivery(opFormModel.id, opFormModel as Delivery)
    } else {
      await postDelivery(opFormModel as Delivery);
    }
    opFormButtonLoading.value = false
    ElNotification.success({title: '操作成功'})
    onOpCancel()
    await getDeliveryList()
  })
}

function onDelete(id: number) {
  destroyDelivery(id).then(res => {
    if (res.data.code == 2000) {
      getDeliveryList()
      ElNotification.success({title: '删除成功'})
    }
  })
}

</script>