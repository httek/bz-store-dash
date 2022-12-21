<template>
  <div class="w-96">
    <el-form
        ref="ruleFormRef"
        :model="loginForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="mobile">
        <el-input v-model.number="loginForm.mobile" placeholder="请输入账号"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="w-full bg-blue-600" @click="submitForm(ruleFormRef)"
        >登录
        </el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {validateMobile, validatePassword} from "./validator";
import {ElNotification} from "element-plus";
import http from "../../utils/http";

const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({password: '', mobile: ''})

const rules = reactive({
  password: [{validator: validatePassword, trigger: 'blur'}],
  mobile: [{validator: validateMobile, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (!valid) {
      return
    }

    http.post('/nice', {mice: 'fa'})
    console.log(loginForm)
  })
}

</script>
