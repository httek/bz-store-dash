import http from "../utils/http";
import {Response} from "../bags/response";
import {Admin} from "../models/admin";

export async function login(payload: {mobile:number, password: string}): Promise<Response|null> {
  const res = await http.post<Response>('v1/auth/login', payload);
  const response = res.data as Response

  return response.code == 2000 ? response : null
}


export async function profile(): Promise<Admin | null> {
  const res = await http.get<Response>('v1/auth/profile');
  const response = res.data as Response

  return response.code == 2000 ? response.data as Admin : null
}
