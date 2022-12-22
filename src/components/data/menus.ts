import {Menu} from "../../models/menu";

export const menus: Menu[] = [
  {
    name: 'Dash', path: '/', title: '概览', icon: 'DataLine', id: 0, children: []
  },
  {
    name: 'Setting', path: '/settings', title: '系统管理', icon: 'SetUp', id: 1, children: [
      {
        name: 'Category', path: 'categories', title: '商品分类', icon: 'Notebook', id: 2
      },
      {
        name: 'Brand', path: 'brands', title: '品牌管理', icon: 'brand', id: 3, children: [
          {name: 'Brand List', path: '/brands/categories', title: '品牌分类', icon: 'brands', id: 4},
          {name: 'Brand List', path: '/brands', title: '品牌列表', icon: 'brands', id: 5}
        ]
      }
    ]
  }
];
