<template>
  <el-page-header class="hide-back p-4 mt-2">
    <template #content>
      <div class="flex items-center">
        <el-icon>
          <Guide />
        </el-icon>
        <el-breadcrumb class="mx-1" separator-icon="DArrowRight">
          <el-breadcrumb-item><b>{{ route.meta.title || '配置管理' }}</b></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button @click="getList()" type="primary" icon="Refresh" circle />
      </div>
    </template>
  </el-page-header>

  <div class="m-4">
    <el-tabs @tab-change="onChangeTab" class="h-full">
      <el-tab-pane v-for="g of Cfg.Groups" :label="g.name">
        <view v-if="g.id == Cfg.Group.Swiper" class="swiper w-full">
          <el-page-header class="hide-back py-4">
            <template #content>
              <div class="flex items-center">
                <el-button :disabled="swiperOpFormButtonLoading" type="primary" @click="onSwiperOp()" icon="Plus"
                  circle />
              </div>
            </template>
          </el-page-header>
          <el-table :border="true" :data="activeItems" row-key="id" highlight-current-row stripe class="w-full">
            <template #empty>
              <el-empty description="暂无数据"></el-empty>
            </template>
            <el-table-column align="left" fixed="left" width="220" prop="mark" label="位置" />
            <el-table-column align="left" prop="value" label="详情">
              <template #default="scope">
                <el-link @click="onSwiperOp(scope.row)" type="primary">{{ scope.row.value.length }} 张图片</el-link>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" min-width="180" label="创建时间" />
            <el-table-column align="center" prop="updated_at" min-width="180" label="更新时间" />
            <el-table-column align="center" fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link @click="onSwiperOp(scope.row)" class="hover:text-blue-500">编辑</el-button>
                <el-popconfirm confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消"
                  icon-color="#626AEF" width="200px" @confirm="onDelete(scope.row.id)" :title="'确定要是删除吗?'">
                  <template #reference>
                    <el-button link class="hover:text-red-500">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </view>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- Swiper -->
  <el-dialog width="760px" v-model="swiperPanelVisible"
    :title="(swiperFormModel.id || 0) > 0 ? `编辑 · ${swiperFormModel.mark || '轮播'}` : '新增'" align-center class="px-2"
    destroy-on-close @close="onCloseSwiperOpPanel" :close-on-click-modal="false">
    <el-form inline status-icon :rules="swiperFormRules" ref="swiperFormRef" :model="swiperFormModel" label-width="60px"
      class="w-full">
      <!-- {{ currentSwiperRow }} -->
      <el-row :gutter="6">
        <el-col :span="24">
          <el-form-item class="w-full" label="位置" required prop="key">
            <el-select :disabled="(swiperFormModel.id || 0) > 0" v-model="swiperFormModel.key" class="w-full"
              placeholder="请选择">
              <el-option :disabled="activeItems.find(el => el.key == item.id) != null" v-for="item in swiperPositions"
                :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="swiperFormModel.key" v-for="(swiper, index) of swiperFormModel.value">
        <div class="rounded bg-gray-100 w-full m-1 pt-4">
          <el-row :gutter="8" class="px-4">
            <el-col :span="4">
              <el-form-item class="w-full" :key="swiper.key" :prop="'value.' + index + '.image'" :rules="{
                required: true,
                message: '请上传图片',
                trigger: 'blur',
              }">
                <el-upload class="w-full" :class="{ 'hide-upload-btn': swiperFormModel.value[index].image }" :limit="1"
                  :on-success="onSwiperImageUploaded(index)" :on-remove="() => swiper.image = ''"
                  accept="image/png,image/jpg,image/jpeg"
                  :file-list="swiper.image ? [{ name: swiper.image, url: swiper.image }] : []" :action="UploadApi"
                  :data="{ index }" :headers="{ Authorization: 'Bearer ' + authStore.token }" list-type="picture-card">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="flex justify-center content-center items-center">
              <el-form-item class="w-full" :key="swiper.target" label="关联">
                <el-select v-model="swiper.target" class="w-full" placeholder="请选择">
                  <el-option v-for="item in swiperTargetClass" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="flex justify-center content-center items-center">
              <el-form-item class="w-full" :key="swiper.resource" label="资源">
                <el-select v-model="swiper.resource" class="w-full" placeholder="请选择">
                  <el-option v-for="item in swiperTargetClass" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseSwiperOpPanel()">取消</el-button>
        <el-button :loading="swiperOpFormButtonLoading" type="primary" @click="onSwiperOpSubmit(swiperFormRef)">{{
          swiperFormModel.id ? '保存' : '添加'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- Swiper  -->
</template>


<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ConfigAPIs } from '../apis/config.api';
import { Response } from '../bags/response';
import { HTTP, UploadApi } from '../consts';
import { Cfg } from '../consts/config';
import { Config } from '../models/config';
import { useAuthStore } from '../states/auth.state';

const authStore = useAuthStore()

const active = ref<number>(0)
const route = useRoute()
const items = ref<Config[]>([])
const activeItems = ref<Config[]>([])

onMounted(async () => {
  await getList()
})

const loadActiveTabItems = () => {
  activeItems.value = items.value.filter(item => item.group == active.value)
}

const getList = async (group: number = -1) => {
  const res = await ConfigAPIs.get(group)
  items.value = res.data
  loadActiveTabItems()
}

const onChangeTab = (index: any) => {
  active.value = Cfg.Groups[index].id || 0
  loadActiveTabItems()
}

const onDelete = async (id: number) => {
  const res = await ConfigAPIs.destroy(id)
  await getList()
  res.code == HTTP.OK && ElMessage.success(res.msg)
}


// Swiper
const swiperPanelVisible = ref(false)
const currentSwiperRow = ref<Config>()
const swiperFormModelInit = {
  key: undefined, value: [{
    image: '', target: 0, resource: ''
  }], id: 0, group: Cfg.Group.Swiper, type: 'array'
}
const swiperFormModel = reactive<Config>({ ...swiperFormModelInit })
const swiperFormRules = reactive({})
const swiperFormRef = ref<FormInstance>()
const swiperPositions = [
  { id: 'swiper.mapp.home', label: '小程序商城主页' },
  { id: 'swiper.mapp.ucenter', label: '小程序个人首页' },
]
const swiperTargetClass = [
  { id: 0, label: '分类' },
  { id: 1, label: '商品' },
]
const swiperOpFormButtonLoading = ref(false)
const onSwiperImageUploaded = (index: number) => {
  return (res: Response) => {
    console.log(res);

    if (res.code == HTTP.OK)
      swiperFormModel.value[index].image = res.data
    else
      ElMessage.error(res.msg || '图片上传失败')
  }
}

const onSwiperOp = (item?: Config) => {
  if (item) {
    currentSwiperRow.value = item
    Object.assign(swiperFormModel, item)
  }

  swiperPanelVisible.value = true
}

const onSwiperOpSubmit = async (form: FormInstance | undefined) => {
  swiperOpFormButtonLoading.value = true
  let res;
  if ((swiperFormModel.id || 0) > 0) {
    res = await ConfigAPIs.update(swiperFormModel.key as string, swiperFormModel)
  } else {
    res = await ConfigAPIs.store(swiperFormModel)
  }

  if (res.code == HTTP.OK) {
    getList()
    onCloseSwiperOpPanel()
    ElMessage.success(res.msg)
  }
}

const onResetSwiperForm = () => {
  Object.assign(
    swiperFormModel,
    { ...((swiperFormModel.id || 0) > 0 ? currentSwiperRow.value : swiperFormModelInit) }
  )

  console.log((swiperFormModel.id || 0) > 0 ? currentSwiperRow.value : swiperFormModelInit);

}
const onCloseSwiperOpPanel = () => {
  swiperPanelVisible.value = false
  Object.assign(swiperFormModel, swiperFormModelInit)
  swiperOpFormButtonLoading.value = false
}

// Swiper End
</script>