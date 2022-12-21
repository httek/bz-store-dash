export interface Response {
  code: number
  message: string
  data: [] | string | boolean | number
}

export interface Paginate {
  data: []
  page: number
  size: number
  total: number
  lastPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginateResponse {
  code: number
  message: string
  data: Paginate
}
