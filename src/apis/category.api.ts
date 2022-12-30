import http from "../utils/http";
import { Response } from "../bags/response";
import { Category } from "../models/category";

export namespace CategoryAPIs {
  /**
   * 获取分类列表
   * 
   * @param search 
   * @returns Response
   */
  export function list(search?: { type: number, name: string }): Promise<Response> {
    return http.get('v1/system/categories', { params: search });
  }

  /**
   * 获取分类选择器
   * 
   * @returns Response
   */
  export function selector(Type: number = 0): Promise<Response> {
    return http.get('/v1/system/categories/select?type=' + Type)
  }


  /**
   * Update category.
   *
   * @param item
   */
  export function update(id: number, item: Category): Promise<Response> {
    return http.post(`/v1/system/categories/${id}`, item)
  }


  /**
   * Add category.
   *
   * @param item
   */
  export function store(item: Category): Promise<Response> {
    return http.post('/v1/system/categories', item)
  }

  /**
   * Del category
   *
   * @param id
   */
  export function destroy(id: number): Promise<Response> {
    return http.delete(`/v1/system/categories/${id}`)
  }
}
