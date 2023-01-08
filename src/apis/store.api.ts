import { PaginateResponse, Response } from "../bags/response";
import { Store } from "../models/store";
import http from "../utils/http";

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
  const prefix = '/v2/stores'

  /**
   * Items
   *
   * @param page
   * @param size
   * @param search
   */
  export function list(page: number = 1, size: number = 1, search?: StoreSearch): Promise<PaginateResponse> {
    return http.get(prefix, { params: { page, size, ...search } })
  }

  /**
   * 完全匹配
   *
   * @param search
   */
  export function precisSearch(search: { key: string, value: any, fields?: string[] }): Promise<Response> {
    return http.get(prefix + '/precise', { params: search })
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

  /**
   * Select
   *  
   * @param name 
   */
  export function select(name?: string): Promise<Response> {
    return http.get(prefix + '/select', { params: { name } })
  }
}
