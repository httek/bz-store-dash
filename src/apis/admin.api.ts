import http from "../utils/http";
import {PaginateResponse} from "../bags/response";

const prefix = '/v1/auth/admins'

export namespace AdminAPIs {
  export function list(page: number = 1, size: number = 10, search?: { mobile?: number, name?: string, type?:number}): Promise<PaginateResponse> {
    return http.get(prefix, {params: {page, size, ...search}})
  }
}
