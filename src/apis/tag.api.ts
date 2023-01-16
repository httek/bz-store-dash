import { PaginateResponse, Response } from "../bags/response";
import http from "../utils/http";
import { Tag } from './../models/tag';

export namespace TagAPIs {
  const prefix = '/v2/tags'

  export function list(page: number = 1, size: number = 10, search?: Tag): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function store(item: Tag): Promise<Response> {
    return http.post(prefix, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }

  export function update(id: number, item: Tag): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function precise(name: string): Promise<Response> {
    return http.get(`${precise}/precise?key=name&value=` + name)
  }

  export function select(name?: string): Promise<Response> {
    return http.get(`${prefix}/select`, { params: { name } })
  }
}