import http from "../utils/http";
import {PaginateResponse, Response} from "../bags/response";
import {Store} from "../models/store";

export interface StoreSearch {
  partner?: string
  name?: string
  cash?: number
  address?: string
  owner_id?: number
  status?: number
  created_at?: string[]
  delivery_template_id?: number
}


export namespace StoreAPIs {
  const prefix = '/v1/system/stores'

  /**
   * Items
   *
   * @param page
   * @param size
   * @param search
   */
  export function list(page: number = 1, size: number = 1, search?: StoreSearch): Promise<PaginateResponse> {
    return http.get(prefix, {params: search})
  }

  /**
   * Detail
   *
   * @param id
   */
  export function show(id: number): Promise<Response> {
    return http.get(`${prefix}/${id}`)
  }

  /**
   * Create
   *
   * @param store
   */
  export function store(store: Store): Promise<Response> {
    return http.post(prefix, store)
  }

  /**
   * Destroy
   *
   * @param id
   */
  export function destroy(id: number): Promise<Response> {
    return http.delete(`${prefix}/${id}`)
  }

  /**
   * Update
   *
   * @param id
   * @param store
   */
  export function update(id: number, store: Store): Promise<Response> {
    return http.post(`${prefix}/${id}`, store)
  }
}
