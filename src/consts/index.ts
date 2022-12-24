const baseUrl = import.meta.env.VITE_BACKEND_API;

export const UploadApi = baseUrl.trim('/') + '/v1/utils/upload'
