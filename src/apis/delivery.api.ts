import {PaginateResponse, Response} from "../bags/response";
import http from "../utils/http";
import {Delivery} from "../models/delivery";

export async function getDeliveries(page:number = 1, size: number = 10, search?: {name: string, type: number}): Promise<PaginateResponse> {
    const res = await http.get('/v1/system/delivery/templates', {
        params: {page, size, ...search}
    })

    return res.data as PaginateResponse
}

export async function postDelivery(item: Delivery): Promise<Response> {
    const res = await http.post('/v1/system/delivery/templates', item);

    return  res.data as Response;
}

export async function destroyDelivery(id: number): Promise<Response> {
    return http.delete(`/v1/system/delivery/templates/${id}`)
}

export async function updateDelivery(id: number, item: Delivery): Promise<Response> {
    return http.post(`/v1/system/delivery/templates/${id}`, item)
}