import { PaginateResponse, Response } from "../bags/response";
import { Category } from "../models/category";
import http from "../utils/http";

export namespace CategoryAPIs {
  /**
   * 获取分类列表
   * 
   * @param search 
   * @returns Response
   */
  export function list(page: number = 1, size: number = 10, search?: { type: number, name: string }): Promise<PaginateResponse> {
    return http.get('v2/categories', { params: { page, size, ...search } });
  }

  /**
   * 获取分类选择器
   * 
   * @returns Response
   */
  export function select(type: number = 1): Promise<Response> {
    return http.get('/v2/categories/select?type=' + type)
  }


  /**
   * Update category.
   *
   * @param item
   */
  export function update(id: number, item: Category): Promise<Response> {
    return http.post(`/v2/categories/${id}`, item)
  }


  /**
   * Add category.
   *
   * @param item
   */
  export function store(item: Category): Promise<Response> {
    return http.post('/v2/categories', item)
  }

  /**
   * Del category
   *
   * @param id
   */
  export function destroy(id: number): Promise<Response> {
    return http.delete(`/v2/categories/${id}`)
  }
}
