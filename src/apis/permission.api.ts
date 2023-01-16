import { Response } from "../bags/response";
import http from "../utils/http";
import { Permission as Model } from './../models/menu';

export namespace PermissionAPIs {
  const prefix = '/v2/permissions'

  export function list(page: number = 1, size: number = 10, search?: Model): Promise<Response> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function store(item: Model): Promise<Response> {
    return http.post(prefix, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }

  export function update(id: number, item: Model): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function precise(path: string): Promise<Response> {
    return http.get(`${precise}/precise?key=path&value=` + path)
  }

  export function select(name?: string): Promise<Response> {
    return http.get(`${prefix}/select`, { params: { name } })
  }
}
