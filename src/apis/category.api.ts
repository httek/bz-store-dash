import http from "../utils/http";
import {Admin} from "../models/admin";
import {Response} from "../bags/response";
import {Category} from "../models/category";

export async function getCategories(search?: {type: number, name: string}): Promise<Category[]> {
  const res = await http.get<Response>('v1/system/categories', {
    params: search
  });
  const response = res.data as Response

  return response.code == 2000 ? response.data as Category[] : []
}
