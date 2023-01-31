import { PaginateResponse, Response } from "../bags/response";
import { Swiper } from "../models/swiper";
import http from "../utils/http";

export namespace SwiperAPIs {
  const prefix = '/v2/swipers';

  export function list(page: number = 1, size: number = 10, params?: { name?: string, status?: number }): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...params } })
  }

  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  export function store(item: Swiper): Promise<Response> {
    return http.post(prefix, item)
  }

  export function update(id: number, item: Swiper): Promise<Response> {
    return http.post(`${prefix}/${id}`, item)
  }

  export function precise(key: string, value: any, ignore?: any): Promise<Response> {
    return http.get(`${prefix}/precise`, { params: { key, value, ignore } })
  }

  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }
}