export interface Response {
  code: number
  msg: string
  data: [] | string | boolean | number | object | any
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
  msg: string
  data: Paginate
}
