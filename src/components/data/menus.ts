import {Menu} from "../../models/menu";

export const menus: Menu[] = [
  {
    name: 'Dash', path: '/', title: '概览', icon: 'DataLine', id: 0, children: []
  },
  {
    name: 'Setting', path: 'system', title: '系统管理', icon: 'SetUp', id: 1, children: [
      {
        name: 'Category', path: '/system/categories', title: '商品分类', icon: 'Notebook', id: 2
      },
      {
        name: 'Store', path: '/system/stores', title: '店铺管理', icon: 'Shop', id: 3
      },
      {
        name: 'Brand', path: 'brands', title: '品牌管理', icon: 'Flag', id: 3, children: [
          {name: 'Brand List', path: '/system/brands/categories', title: '品牌分类', icon: 'Flag', id: 4},
          {name: 'Brand List', path: '/system/brands', title: '品牌列表', icon: 'Flag', id: 5}
        ]
      },
      {
        name: 'Delivery', path: '/system/delivery/templates', title: '配送模版', icon: 'Van', id: 8
      },
    ]
  }
];
