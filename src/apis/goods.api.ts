import { PaginateResponse, Response } from "../bags/response";
import { Goods } from "../models/goods";
import http from "../utils/http";

export namespace GoodsAPIs {
  const prefix = '/v2/goods'

  export function list(page: number = 1, size: number = 10, search?: Goods): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function update(id: number, item: Goods): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function store(item: Goods): Promise<Response> {
    return http.post(prefix, item)
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }
}