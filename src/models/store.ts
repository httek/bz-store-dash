export interface CashMeta {
  account?: string | null
  account_name?: string | null
  account_bank?: string | null
}

export interface Store {
  id: number
  partner?: string
  name?: string
  cover?: string | null
  photos?: string[] | null
  cash?: number
  cash_meta: CashMeta
  address?: string | null
  aptitude?: any
  deposit?: number
  phone?: string | null
  deduct?: number
  sequence?: number
  created_by?: string
  owner_id?: number
  status?: number
  description?: string
  expired_at?: string | null | ''
  created_at?: string
  updated_at?: string
}
