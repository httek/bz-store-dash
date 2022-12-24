import http from "../utils/http";
import {Response} from "../bags/response";
import {Category} from "../models/category";

/**
 * Get categories.
 *
 * @param search
 */
export async function getCategories(search?: { type: number, name: string }): Promise<Category[]> {
  const res = await http.get<Response>('v1/system/categories', {
    params: search
  });
  const response = res.data as Response
  return response.code == 2000 ? response.data as Category[] : []
}

/**
 * Fetch categories for select options.
 */
export async function getCategoriesSelector(): Promise<Category[]> {
  const res = await http.get<Response>('/v1/system/categories/select')
  const response = res.data as Response;

  return response.code == 2000 ? response.data as Category[] : []
}


/**
 * Update category.
 *
 * @param item
 */
export async function updateCategory(id: number, item: Category): Promise<Response> {
  return await http.post(`/v1/system/categories/${id}`, item)
}


/**
 * Add category.
 *
 * @param item
 */
export async function addCategory(item: Category): Promise<Response> {
  return await http.post('/v1/system/categories', item)
}

/**
 * Del category
 *
 * @param id
 */
export async function delCategory(id: number): Promise<Response> {
  return (await http.delete(`/v1/system/categories/${id}`)).data as Response
}
