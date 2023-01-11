import { Response } from "../bags/response";
import http from "../utils/http";

export async function login(payload: { mobile: number, password: string }): Promise<Response> {
  return await http.post('v2/auth/login', payload);
}

/**
 * 获取登录用户信息
 * 
 * @returns Promisse<Admin | null>
 */
export async function getAuthSession(): Promise<Response> {
  return await http.get('v2/auth/session');
}
