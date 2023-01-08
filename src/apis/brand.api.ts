import { PaginateResponse, Response } from "../bags/response";
import { Brand } from "../models/brand";
import http from "../utils/http";

export namespace BrandAPIs {
  export function list(page: number = 1, size: number = 10, params?: { name?: string, status?: number }): Promise<PaginateResponse> {
    return http.get('/v2/brands', { params: { page, size, ...params } })
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`/v2/brands/${id}`)
  }

  export function store(item: Brand): Promise<Response> {
    return http.post('/v2/brands', item)
  }

  export function update(id: number, item: Brand): Promise<Response> {
    return http.post(`/v2/brands/${id}`, item)
  }

  export function select(name?: string): Promise<Response> {
    return http.get(`/v2/brands/select`, { params: { name } })
  }
}