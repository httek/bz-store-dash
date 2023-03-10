import { PaginateResponse, Response } from "../bags/response";
import { Block } from "../models/block";
import http from "../utils/http";

export namespace BlockAPIs {
  const prefix = '/v2/blocks';
  export function list(page: number = 1, size: number = 10, params?: { name?: string, status?: number }): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...params } })
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function store(item: Block): Promise<Response> {
    return http.post(prefix, item)
  }

  export function update(id: number, item: Block): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }
}