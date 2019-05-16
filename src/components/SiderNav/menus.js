const menus = [
  {
    title: '首页',
    icon: 'home',
    key: '/'
  },
  {
    title: '权限管理',
    icon: 'usergroup-add',
    key: '/permission',
    testType: 'localTest',
    subs: [
      {
        title: '角色管理',
        icon: 'solution',
        key: '/permission/roles'
      },
      {
        title: '用户管理',
        icon: 'team',
        key: '/permission/users'
      },
    ]
  },
  {
    title: '物流管理',
    icon: 'rocket',
    key: '/logistics-manage',
    subs: [
      {
        title: 'BC清关',
        icon: 'global',
        key: '/logistics-manage/BC-customsClearance' ,
        subs: [
          {
            title: '扫码录入商品',
            icon: 'gift',
            key: '/logistics-manage/BC-customsClearance/commodities-packaging'
          },
          {
            title: '圆通物流',
            icon: 'sync',
            key: '/logistics-manage/BC-customsClearance/YTO'
          },
          {
            title: 'BC推单',
            icon: 'file-excel',
            key: '/logistics-manage/BC-customsClearance/upload-order'
          },
        ]
      },
      {
        title: 'ETK',
        icon: 'global',
        key: '/logistics-manage/ETK' ,
        subs: [
          {
            title: '未匹配订单',
            icon: 'file-unknown',
            key: '/logistics-manage/ETK/unmatched'
          },
          {
            title: '已匹配订单',
            icon: 'file-done',
            key: '/logistics-manage/ETK/matched'
          }
        ]
      },
      {
        title: '邮政',
        icon: 'global',
        key: '/logistics-manage/postal',
        subs: [
          {
            title: '未推送订单',
            icon: 'file-unknown',
            key: '/logistics-manage/postal/not-pushed'
          },
          {
            title: '已推送订单',
            icon: 'file-done',
            key: '/logistics-manage/postal/pushed'
          },
        ]
      },
      {
        title: '全球运转',
        icon: 'global',
        key: '/logistics-manage/globalTranshipment',
        subs: [
          {
            title: '未到货',
            icon: 'file-unknown',
            key: '/logistics-manage/globalTranshipment/not-arrived'
          },
          {
            title: '已到货',
            icon: 'file-done',
            key: '/logistics-manage/globalTranshipment/arrived'
          },
        ]
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
      },
      {
        title: '预约上门打包',
        icon: 'solution',
        key: '/reservation-service/appointment-info',
      },
      {
        title: '全球跑腿预订',
        icon: 'solution',
        key: '/reservation-service/global-errands',
        testType: 'localTest'
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
    ]
  },
  // 本地专用
  {
    title: '开发人员专用',
    icon: 'like',
    key: '/developer-pages',
    testType: 'localTest',
    subs: [
      {
        title: '导入excel',
        icon: 'file-excel',
        key: '/developer-pages/import-excel'
      }
    ]
  }
];

export default menus;