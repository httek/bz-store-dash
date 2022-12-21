import {Response} from "../bags/response";
import http from "../utils/http";

export function login(payload: {mobile:number, password: string}) {
  return http.post('/auth/login', payload);
}
