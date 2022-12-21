import axios, {AxiosResponse} from "axios";
import {Cache} from "./cache";
import {TokenCacheKey} from "../consts/auth";

const http = axios.create()
http.interceptors.request.use(config => {
  const token = Cache.get(TokenCacheKey)
  if (token) {
    config.headers = {Authorization: 'Bearer ' + token, ...config.headers}
  }

  if (config.url && !config.url.startsWith('http')) {
    config.baseURL = import.meta.env.VITE_BACKEND_API
  }

  console.log(config)
  return config
})

http.interceptors.response.use((response: AxiosResponse) => {
  return response
})


export default http
