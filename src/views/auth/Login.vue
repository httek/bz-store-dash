<template>
  <div class="w-96">
    <el-form ref="ruleFormRef" :model="loginForm" status-icon :rules="rules" label-width="120px">
      <el-form-item label="账号" prop="mobile">
        <el-input autofocus v-model.number="loginForm.mobile" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="loginForm.password" placeholder="请输入密码" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full bg-blue-600" @click="submitForm(ruleFormRef)">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validators } from '../../validators/index'
import { login } from "../../apis/auth.api";
import { Cache } from "../../utils/cache";
import { TokenCacheKey } from "../../consts/auth";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../states/auth.state";
import { HTTP } from '../../consts';
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({ password: '', mobile: '' })

const rules = reactive<any>({
  mobile: [{ validator: validators.mobile, trigger: 'blur' }],
  password: [{ validator: validators.password, trigger: 'blur' }],
})

const value = ref([])

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) {
      return
    }

    const response = await login(loginForm as any)
    if (response.code != HTTP.OK) {
      return
    }

    Cache.set(TokenCacheKey, response.data.token, 3600 * 24)
    authStore.profile = response.data
    await router.push({ path: (route.query['redirect'] as string) || '/' })
  })
}

</script>
