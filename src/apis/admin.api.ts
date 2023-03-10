import { PaginateResponse, Response } from "../bags/response";
import { Admin } from "../models/admin";
import http from "../utils/http";

export namespace AdminAPIs {
  const prefix = '/v2/admins'
  export function select(type: number = 1): Promise<Response> {
    return http.get(`${prefix}/select?type=${type}`)
  }
  export function list(page: number = 1, size: number = 10, params?: any): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...params } })
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function store(item: Admin): Promise<Response> {
    return http.post(prefix, item)
  }
  export function update(id: number, item: Admin): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }
}
