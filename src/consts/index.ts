const BackendApiHost = import.meta.env.VITE_BACKEND_API;


export namespace Layout {
  export const AsideMaxWidth = 210
  export const AsideMinWidth = 64
  export const HeaderHeight = 50
  export const AsideCollapsedStatusCacheKey = 'aside-collapsed'
  export const LogoHeight = 68
}

export const UploadApi = BackendApiHost.trim('/') + '/v1/utils/upload'

export namespace HTTP {
  export const OK = 2000
  export const FAIL = 5000
}