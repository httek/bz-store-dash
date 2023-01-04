import { Menu } from "../../models/menu";

export const menus: Menu[] = [
  {
    name: 'Dash', path: '/', title: '概览', icon: 'DataLine', id: 0, children: []
  },
  { name: 'Brand List', path: '/brands', title: '品牌', icon: 'Flag', id: 5 },
  {
    name: 'Category', path: '/categories', title: '分类', icon: 'Guide', id: 2,
  },
  {
    name: 'Store', path: '/stores', title: '店铺', icon: 'Shop', id: 3
  },
  {
    name: 'Delivery', path: '/delivery', title: '配送', icon: 'Van', id: 8
  },
  {
    name: 'Product', path: '/products', title: '产品', icon: 'Van', id: 198
  },
  {
    name: 'Goods', path: '/goods', title: '商品', icon: 'Van', id: 1980
  }
];
