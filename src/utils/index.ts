import { Router } from "vue-router";
import { Menu as MenuConst } from "../consts";
import { Menu } from "../models/menu";

export const addRoute = (router: Router, item: Menu) => {
  if (item.type == MenuConst.Type.View) {
    router.addRoute(item.slug || '', {
      path: item.path || '',
      component: () => import(`../views/${item.component}`),
      meta: { ...item.meta }
    })
  }

  if (item.children?.length) {
    item.children.map(child => addRoute(router, child))
  }
}