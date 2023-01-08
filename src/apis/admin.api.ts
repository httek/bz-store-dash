import { PaginateResponse, Response } from "../bags/response";
import http from "../utils/http";

const prefix = '/v2/admins'

export namespace AdminAPIs {
  export function list(page: number = 1, size: number = 10, search?: { mobile?: number, name?: string, type?: number }): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  export function select(type: number = 1): Promise<Response> {
    return http.get(`${prefix}/select?type=${type}`)
  }
}
