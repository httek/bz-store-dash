const baseUrl = import.meta.env.VITE_BACKEND_API;


export namespace Layout {
  export const AsideMaxWidth = 210
  export const AsideMinWidth = 50
  export const HeaderHeight = 50
  export const AsideCollapsedStatusCacheKey = 'aside-collapsed'
}

export const UploadApi = baseUrl.trim('/') + '/v1/utils/upload'

export namespace HTTP {
  export const OK = 2000
  export const FAIL = 5000
}