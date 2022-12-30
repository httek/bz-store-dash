import { PaginateResponse } from "../bags/response";
import http from "../utils/http";

export namespace BrandAPIs {
  export function list(page: number = 1, size: number = 10, params?: { name?: '' }): Promise<PaginateResponse> {
    return http.get('/v1/system/brands', { params })
  }
}