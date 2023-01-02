import { Admin } from "./admin"
import { Brand } from "./brand"
import { Category } from "./category"
import { Delivery } from "./delivery"
import { Product } from "./product"
import { Store } from "./store"

export interface Goods {
  id?: number
  owner_id?: number
  product_id?: number
  store_id?: number
  brand_id?: number
  category_id?: number
  delivery_template_id?: number
  uuid?: string
  name?: string
  slogan?: string
  tips?: string
  price?: number
  origin_price?: number
  tags?: string[]
  images?: string[]
  details?: string[]
  material?: string
  description?: string
  stock?: number
  sold?: number
  status?: number
  delivery_free?: number
  sequence?: number
  created_at?: string
  updated_at?: string

  category?: Category | null
  product?: Product | null
  owner?: Admin | null
  store?: Store | null
  brand?: Brand | null
  delivery?: Delivery | null
}