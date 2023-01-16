import { Response } from "../bags/response";
import http from "../utils/http";
import { Role as Model } from './../models/role';

export namespace RoleAPIs {
  const prefix = '/v2/roles'

  export function list(page: number = 1, size: number = 10, search?: Model): Promise<Response> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function store(item: Model): Promise<Response> {
    return http.post(prefix, item)
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }

  export function attachPermissions(id: number, permissions: number[]): Promise<Response> {
    return http.post(`${prefix}/${id}/permissions`, { permissions })
  }

  export function update(id: number, item: Model): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function precise(name: string): Promise<Response> {
    return http.get(`${prefix}/precise?key=name&value=` + name)
  }

  export function select(name?: string): Promise<Response> {
    return http.get(`${prefix}/select`, { params: { name } })
  }
}
