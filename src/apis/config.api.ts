import { Response } from "../bags/response";
import { Config } from "../models/config";
import http from "../utils/http";

export namespace ConfigAPIs {
  const prefix = 'v2/configs'

  export function get(group: number = -1): Promise<Response> {
    return http.get(prefix, { params: { group } })
  }

  export function store(item: Config): Promise<Response> {
    return http.post(prefix, item)
  }

  export function destroy(key: string): Promise<Response> {
    return http.delete(`${prefix}/${key}`)
  }

  export function update(key: string, item: Config): Promise<Response> {
    return http.post(`${prefix}/${key}`, item)
  }

  export function show(key: string): Promise<Response> {
    return http.get(prefix + '/' + key)
  }
}