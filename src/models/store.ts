export interface Store {
  id: number
  partner?: string
  name?: string
  logo?: string | null
  photos?: string[] | null
  cash?: number
  cash_meta?: any
  address?: string | null
  aptitude?: any
  deposit?: number
  phone?: string | null
  deduct?: number
  sequence?: number
  created_by?: string
  owner_id?: number
  delivery_template_id?: number | null
  status?: number
  created_at?: string
  updated_at?: string
}
