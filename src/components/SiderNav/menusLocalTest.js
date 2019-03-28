const menusLocalTest = [
  {
    title: '首页',
    icon: 'home',
    key: '/'
  },
  {
    title: '物流管理',
    icon: 'rocket',
    key: '/logistics-manage',
    subs: [
      {
        title: '预约上门打包',
        icon: 'solution',
        key: '/logistics-manage/appointment-info',
      },
      {
        title: '未匹配订单',
        icon: 'file-unknown',
        key: '/logistics-manage/unmatched'
      },
      {
        title: '已匹配订单',
        icon: 'file-done',
        key: '/logistics-manage/matched'
      }
    ]
  },
  {
    title: '返点管理',
    icon: 'pay-circle',
    key: '/rebate-manage',
    subs: [
      {
        title: '预约挂团',
        icon: 'snippets',
        key: '/rebate-manage/appointment-team-manage',
      },
      {
        title: '设置返点',
        icon:'edit',
        key: '/rebate-manage/set-rebate'
      },
      {
        title: '对账管理',
        icon: 'diff',
        key: '/rebate-manage/count-bill-list',
      },
      {
        title: '待审核',
        icon: 'file-unknown',
        key: '/rebate-manage/awaiting-examine',
      },
      {
        title: '待返款',
        icon: 'meh',
        key: '/rebate-manage/adopt-examine-unpaid',
      },
      {
        title: '已返款',
        icon: 'smile',
        key: '/rebate-manage/adopt-examine-paid',
      },
      {
        title: '驳回',
        icon: 'frown',
        key: '/rebate-manage/reject-examine',
      },
      {
        title: '上传日上二维码',
        icon: 'qrcode',
        key: '/rebate-manage/update-QR-code',
      },
    ]
  },
  {
    title: '服务预定管理',
    icon: 'tags',
    key: '/reservation-service',
    subs: [
      {
        title: '预约接送机',
        icon: 'exclamation-circle',
        key: '/reservation-service/airport-transfer'
      }
    ]
  },
  {
    title: '商品管理',
    icon: 'shop',
    key: '/commodities-manage',
    subs: [
      {
        title: '商品资料库',
        icon: 'database',
        key: '/commodities-manage/commodities-database'
      },
      {
        title: '商品打包',
        icon: 'gift',
        key: '/commodities-manage/commodities-packaging'
      }
    ]
  },
  {
    title: 'BC清关',
    icon: 'retweet',
    key: '/bc-customsClearance' ,
    subs: [
      {
        title: '圆通物流',
        icon: 'sync',
        key: '/BC_customsClearance/yuantong'
      },
      {
        title: 'BC推单',
        icon: 'file-excel',
        key: '/BC_customsClearance/upload-order'
      },
    ]
  },
  // 本地专用
  {
    title: '开发人员专用',
    icon: 'like',
    key: '/developer-pages',
    subs: [
      {
        title: '导入excel',
        icon: 'file-excel',
        key: '/developer-pages/import-excel'
      }
    ]
  }
];

export default menusLocalTest;