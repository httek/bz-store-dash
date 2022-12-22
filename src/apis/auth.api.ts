import http from "../utils/http";
import {Response} from "../bags/response";

export async function login(payload: {mobile:number, password: string}): Promise<Response|null> {
  const res = await http.post<Response>('v1/auth/login', payload);
  const response = res.data as Response

  return response.code == 2000 ? response : null
}
