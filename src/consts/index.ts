const baseUrl = import.meta.env.VITE_BACKEND_API;

export const UploadApi = baseUrl.trim('/') + '/v1/utils/upload'

export namespace HTTP {
  export const OK = 2000
  export const FAIL = 5000
}