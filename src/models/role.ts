export interface Role {
  id: number
  name: string
  status?: number,
  description?: string,
  permissionIds?: number[] | null
  created_at?: string | null
  updated_at?: string | null
}
