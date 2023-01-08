import axios, { AxiosResponse } from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { Response } from "../bags/response";
import { TokenCacheKey } from "../consts/auth";
import { Cache } from "./cache";

const http = axios.create()
http.interceptors.request.use(config => {
  const token = Cache.get(TokenCacheKey)
  if (token) {
    config.headers = { Authorization: 'Bearer ' + token, ...config.headers }
  }

  if (config.url && !config.url.startsWith('http')) {
    config.baseURL = import.meta.env.VITE_BACKEND_API
  }

  return config
},
  error => {
    ElNotification.error({ title: '网路异常', message: '当前网络异常、请检查网络设置' })
    return Promise.reject(error)
  }
)

http.interceptors.response.use(async (httpResponse: AxiosResponse) => {
  const response = httpResponse.data as (Response | any)
  if (response.code != 2000) {
    ElMessage.warning(response.msg)
  }

  return response
}, err => {
  ElNotification.closeAll()
  ElNotification.error({ title: '服务器异常，请稍后再试!', message: '服务器异常，请稍后再试!' })

  return err
});


export default http
