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
  status?: number | null
  component?: string | null
  sequence?: number | null
  children?: Menu[] | null
  parent_id?: number | null
  checked?: boolean | null
}


export interface Permission extends Menu { }
