import axios from "axios";
import {useAuthStore} from "../states/auth.state";
import {Cache} from "./cache";
import {TokenCacheKey} from "../consts/auth";

const http = axios.create({
  baseURL: ''
})

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


export default http
