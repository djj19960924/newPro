const menus = [
  // {
  //   title: '首页',
  //   icon: 'home',
  //   key: '/'
  // },
  {
    title: '订单',
    icon: 'file-text',
    key: '/order',
    subs: [
      {
        title: '未匹配订单',
        icon: 'file-text',
        key: '/order/unmatched'
      },
      {
        title: '已匹配订单',
        icon: 'file-done',
        key: '/order/matched'
      }
    ]
  },
  {
    title: '预约信息',
    icon: 'smile',
    key: '/appointment-info',
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: '/about'
  }
]

export default menus;