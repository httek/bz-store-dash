import { PaginateResponse, Response } from "../bags/response";
import { Delivery } from "../models/delivery";
import http from "../utils/http";

export namespace DeliveryAPIs {
	const prefix = 'v2/deliveries'

	export function list(page: number = 1, size: number = 10, search?: { name: string, type: number }): Promise<PaginateResponse> {
		return http.get(prefix, { params: { page, size, ...search } })
	}

	export function store(item: Delivery): Promise<Response> {
		return http.post(prefix, item)
	}

	export function destroy(id: number): Promise<Response> {
		return http.delete(`${prefix}/${id}`)
	}

	export function update(id: number, item: Delivery): Promise<Response> {
		return http.post(`${prefix}/${id}`, item)
	}
}