<template>
  <div class="auth flex justify-center items-center content-center h-full bg-slate-50">
    <el-card :body-style="{ padding: '0px 22px 18px' }" class="shadow-sm w-96 border-0 mb-20">
      <template #header>
        <el-row class="auth-header h-full">
          <el-col :span="12" class="p-4">
            <h2 class=" font-bold mt-4">圆堂科技</h2>
            <div class="text-sm my-4">登录您的账号</div>
          </el-col>
          <el-col :span="12">
            <el-image src="https://fs.assets.icraft.ltd/illustrations/profile-img.png"></el-image>
          </el-col>
        </el-row>
      </template>
      <template #default>
        <el-form label-position="top" ref="ruleFormRef" :model="loginForm" status-icon :rules="rules" label-width="60px"
          class="w-full mt-6">
          <el-form-item label="账号" prop="mobile">
            <el-input autofocus v-model.number="loginForm.mobile" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input show-password v-model="loginForm.password" placeholder="请输入密码" type="password" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.remember"> 记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" :disabled="loading" type="primary" class="w-full bg-blue-600"
              @click="submitForm(ruleFormRef)">登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="foot flex justify-center mt-8 mb-1">
          <span class="text-sm text-center font-light text-slate-300">
            © {{ (new Date).getFullYear() }} 圆堂科技.
            <span>Crafted with by </span> <a href="https://m-io.cn" target="_blank">MIO</a>
          </span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style>
.auth-header {
  background-color: rgba(85, 110, 230, .35) !important;
}

.el-card .el-card__header {
  padding: 0 !important;
  border: 0;
}
</style>

<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { login } from "../apis/auth.api";
import { HTTP } from '../consts';
import { TokenCacheKey } from "../consts/auth";
import { Cache } from "../utils/cache";
import { validators } from '../validators';
const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({ password: '', mobile: '', remember: false })
const loading = ref<boolean>(false)

const rules = reactive<any>({
  mobile: [{ validator: validators.mobile, trigger: 'blur' }],
  password: [{ validator: validators.password, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true
    const response = await login(loginForm as any)
    if (response.code == HTTP.OK) {
      Cache.set(TokenCacheKey, response.data.token, 3600 * 24)
      ElMessage.success('登录成功')
      setTimeout(() => {
        loading.value = false
        router.replace({ path: (route.query['redirect'] as string) || '/' })
      }, 1000)
    }
    else {
      loading.value = false
    }
  })
}

</script>
