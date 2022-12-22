export interface Meta {
  auth?: boolean | null
  title?: string | null
  params?: any | null
}

export interface Menu {
  id?: number | null
  icon?: string | null
  name?: string | null
  path?: string | null
  meta?: Meta | null
  title?: string | null
  component?: string | null
  children?: Menu[] | null
}
