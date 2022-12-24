import axios, {AxiosResponse} from "axios";
import {Cache} from "./cache";
import {TokenCacheKey} from "../consts/auth";
import {ElNotification} from "element-plus";
import {Response} from "../bags/response";
import {useRouter} from "vue-router";

const http = axios.create()
const router = useRouter()
http.interceptors.request.use(config => {
  const token = Cache.get(TokenCacheKey)
  if (token) {
    config.headers = {Authorization: 'Bearer ' + token, ...config.headers}
  }

  if (config.url && !config.url.startsWith('http')) {
    config.baseURL = import.meta.env.VITE_BACKEND_API
  }

  return config
})

http.interceptors.response.use((httpResponse: AxiosResponse) => {
  const statusCode = httpResponse.status
  if (statusCode != 200) {
    ElNotification.error({title: '网路异常', message: '当前网络异常、请检查网络设置'})

    return httpResponse;
  }

  let response = httpResponse.data as Response
  switch (response.code)
  {
    case 5000:
    case 4040:
      ElNotification.closeAll()
      ElNotification.error({title: '出错了', message: response.msg || '业务数据异常'})

      break;

    case 4010:
      ElNotification.closeAll()
      ElNotification.warning({title: '未授权', message: '请登录后在操作'})
      router.push({path: '/auth/login'})

      break;
  }

  return httpResponse;
})


export default http
