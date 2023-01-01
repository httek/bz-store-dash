import { PaginateResponse, Response } from "../bags/response";
import { Brand } from "../models/brand";
import http from "../utils/http";

export namespace BrandAPIs {
  export function list(page: number = 1, size: number = 10, params?: { name?: string, status?: number }): Promise<PaginateResponse> {
    return http.get('/v1/system/brands', { params })
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`/v1/system/brands/${id}`)
  }

  export function store(item: Brand): Promise<Response> {
    return http.post('/v1/system/brands', item)
  }

  /**
   * Update item.
   * 
   * @param id 
   * @param item 
   * @returns Response
   */
  export function update(id: number, item: Brand): Promise<Response> {
    return http.post(`/v1/system/brands/${id}`, item)
  }
}