import http from "../utils/http";
import { Admin } from "../models/admin";
import { Response } from "../bags/response";

export async function login(payload: { mobile: number, password: string }): Promise<Response> {
  return await http.post('v1/auth/login', payload);
}

/**
 * 获取登录用户信息
 * 
 * @returns Promisse<Admin | null>
 */
export async function getAuthProfile(): Promise<Response> {
  return await http.get('v1/auth/profile');
}
