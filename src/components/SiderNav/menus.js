const menus = [
  {
    title: '首页',
    icon: 'home',
    key: '/'
  },
  {
    title: '一级标题',
    icon: 'home',
    key: '/home/first',
    subs: [
      {
        title: '二级标题',
        icon: 'home',
        key: '/home/first/second',
        subs: [
          {key: '/home/first/second/third1', title: '三级标题', icon: '',},
          {key: '/home/first/second/third2', title: '三级标题', icon: '',},
        ]
      }
    ]
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: '/home/about'
  }
]

export default menus;