import { Menu as MenuConst } from "../consts"

export interface Meta {
  auth?: boolean | null
  title?: string | null
  params?: any | null
}

export interface Menu {
  id?: number | null
  icon?: string | null
  slug?: string | null
  name?: string | null
  path?: string | null
  meta?: Meta | null
  type?: MenuConst.Type
  title?: string | null
  component?: string | null
  children?: Menu[] | null
}
