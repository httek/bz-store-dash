import { PaginateResponse, Response } from "../bags/response";
import http from "../utils/http";
import { Delivery } from "../models/delivery";

export namespace DeliveryAPIs {
	export function list(page: number = 1, size: number = 10, search?: { name: string, type: number }): Promise<PaginateResponse> {
		return http.get('/v1/system/delivery/templates', { params: { page, size, ...search }})
	}

	export function store(item: Delivery): Promise<Response> {
		return http.post('/v1/system/delivery/templates', item)
	}

	export function destroy(id: number): Promise<Response> {
		return http.delete(`/v1/system/delivery/templates/${id}`)
	}

	export function update(id: number, item: Delivery): Promise<Response> {
		return http.post(`/v1/system/delivery/templates/${id}`, item)
	}
}