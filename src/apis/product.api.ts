import { PaginateResponse, Response } from "../bags/response";
import { Product } from "../models/product";
import http from "../utils/http";

export namespace ProductAPIs {
  const prefix = '/v1/system/products'

  export function list(page: number = 1, size: number = 10, search?: Product): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function store(item: Product): Promise<Response> {
    return http.post(prefix, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }

  export function update(id: number, item: Product): Promise<Response> {
    return http.post(`${prefix}.${id}`, item)
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }
}