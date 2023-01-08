export interface Category {
  id: number
  type: number
  name: string
  cover?: string | null
  status: number
  sequence: number
  parent?: Category | null
  parent_id?: number | null
  created_at: string | null
  updated_at: string | null
  children?: Category[] | null
}
