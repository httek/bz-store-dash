export namespace Cfg {
  export enum Group {
    Default = 0, // 默认
    Swiper,     // 轮播
    Block,      // 推荐位
    Payment,     // 支付
    Nav
  }

  export const Groups = [
    { id: Group.Default, name: '默认' },
    { id: Group.Nav, name: '导航' },
    { id: Group.Swiper, name: '轮播' },
    { id: Group.Block, name: '推荐位' },
    { id: Group.Payment, name: '支付' },
  ]
}