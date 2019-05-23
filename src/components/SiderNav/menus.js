const menus = [
  {
    title: '首页',
    id: 24,
    icon: 'home',
    key: '/',
    components: [
      {name: 'Home', path: '/'}
    ]
  },
  {
    title: '用户管理',
    id: 1,
    icon: 'usergroup-add',
    key: '/users',
    testType: 'localTest',
    subs: [
      {
        title: '权限管理',
        id: 15,
        icon: 'lock',
        key: '/users/permissions',
        components: [
          {name: 'permissions', path: '/users/permissions'}
        ]
      },
      {
        title: '角色管理',
        id: 10,
        icon: 'solution',
        key: '/users/roles',
        components: [
          {name: 'roles', path: '/users/roles'}
        ]
      },
      {
        title: '账户管理',
        id: 2,
        icon: 'team',
        key: '/users/accounts',
        components: [
          {name: 'accounts', path: '/users/accounts'}
        ]
      },
    ]
  },
  {
    title: '物流管理',
    id: 26,
    icon: 'rocket',
    key: '/logistics-manage',
    subs: [
      {
        title: 'BC清关',
        id: 27,
        icon: 'global',
        key: '/logistics-manage/BC-customsClearance/',
        subs: [
          {
            title: '扫码录入商品',
            id: 31,
            icon: 'gift',
            key: '/logistics-manage/BC-customsClearance/commodities-packaging',
            components: [
              {name: 'commoditiesPackaging', path: '/logistics-manage/BC-customsClearance/commodities-packaging'},
              {name: 'customerLogin', path: '/logistics-manage/BC-customsClearance/commodities-packaging/customer-login'}
            ]
          },
          {
            title: '圆通物流',
            id: 32,
            icon: 'sync',
            key: '/logistics-manage/BC-customsClearance/YTO',
            components: [
              {name: 'YTO', path: '/logistics-manage/BC-customsClearance/YTO'}
            ]
          },
          {
            title: 'BC推单',
            id: 33,
            icon: 'file-excel',
            key: '/logistics-manage/BC-customsClearance/upload-order',
            components: [
              {name: 'BCUploadOrder', path: '/logistics-manage/BC-customsClearance/upload-order'}
            ]
          },
        ]
      },
      {
        title: 'ETK',
        id: 28,
        icon: 'global',
        key: '/logistics-manage/ETK',
        subs: [
          {
            title: '未匹配订单',
            id: 34,
            icon: 'file-unknown',
            key: '/logistics-manage/ETK/unmatched',
            components: [
              {name: 'orderUnmatched', path: '/logistics-manage/ETK/unmatched'}
            ]
          },
          {
            title: '已匹配订单',
            id: 35,
            icon: 'file-done',
            key: '/logistics-manage/ETK/matched',
            components: [
              {name: 'orderMatched', path: '/logistics-manage/ETK/matched'}
            ]
          }
        ]
      },
      {
        title: '邮政',
        id: 29,
        icon: 'global',
        key: '/logistics-manage/postal',
        subs: [
          {
            title: '未推送订单',
            id: 36,
            icon: 'file-unknown',
            key: '/logistics-manage/postal/not-pushed',
            components: [
              {name: 'orderNotPushed', path: '/logistics-manage/postal/not-pushed'}
            ]
          },
          {
            title: '已推送订单',
            id: 37,
            icon: 'file-done',
            key: '/logistics-manage/postal/pushed',
            components: [
              {name: 'orderPushed', path: '/logistics-manage/postal/pushed'}
            ]
          },
        ]
      },
      {
        title: '全球运转',
        id: 30,
        icon: 'global',
        key: '/logistics-manage',
        subs: [
          {
            title: '未到货',
            id: 38,
            icon: 'file-unknown',
            key: '/logistics-manage/globalTranshipment/not-arrived',
            components: [
              {name: 'globalTranshipmentNotArrived', path: '/logistics-manage/globalTranshipment/not-arrived'}
            ]
          },
          {
            title: '已到货',
            id: 39,
            icon: 'file-done',
            key: '/logistics-manage/globalTranshipment/arrived',
            components: [
              {name: 'globalTranshipmentArrived', path: '/logistics-manage/globalTranshipment/arrived'}
            ]
          },
        ]
      }
    ]
  },
  {
    title: '返点管理',
    id: 40,
    icon: 'pay-circle',
    key: '/rebate-manage',
    subs: [
      {
        title: '预约挂团',
        id: 45,
        icon: 'snippets',
        key: '/rebate-manage/appointment-team-manage',
        components: [
          {name: 'appointmentTeamManage', path: '/rebate-manage/appointment-team-manage'}
        ]
      },
      {
        title: '设置返点',
        id: 46,
        icon:'edit',
        key: '/rebate-manage/set-rebate',
        components: [
          {name: 'setRebate', path: '/rebate-manage/set-rebate'}
        ]
      },
      {
        title: '对账管理',
        id: 47,
        icon: 'diff',
        key: '/rebate-manage/count-bill-list',
        components: [
          {name: 'countBillList', path: '/rebate-manage/count-bill-list'}
        ]
      },
      {
        title: '待审核',
        id: 48,
        icon: 'file-unknown',
        key: '/rebate-manage/awaiting-examine',
        components: [
          {name: 'awaitingExamine', path: '/rebate-manage/awaiting-examine'}
        ]
      },
      {
        title: '待返款',
        id: 49,
        icon: 'meh',
        key: '/rebate-manage/adopt-examine-unpaid',
        components: [
          {name: 'adoptExamineUnpaid', path: '/rebate-manage/adopt-examine-unpaid'}
        ]
      },
      {
        title: '已返款',
        id: 50,
        icon: 'smile',
        key: '/rebate-manage/adopt-examine-paid',
        components: [
          {name: 'adoptExaminePaid', path: '/rebate-manage/adopt-examine-paid'}
        ]
      },
      {
        title: '驳回',
        id: 51,
        icon: 'frown',
        key: '/rebate-manage/reject-examine',
        components: [
          {name: 'rejectExamine', path: '/rebate-manage/reject-examine'}
        ]
      },
      {
        title: '上传日上二维码',
        id: 52,
        icon: 'qrcode',
        key: '/rebate-manage/update-QR-code',
        components: [
          {name: 'updateQRCode', path: '/rebate-manage/update-QR-code'}
        ]
      },
    ]
  },
  {
    title: '服务预定管理',
    id: 41,
    icon: 'tags',
    key: '/reservation-service',
    subs: [
      {
        title: '预约接送机',
        id: 53,
        icon: 'exclamation-circle',
        key: '/reservation-service/airport-transfer',
        components: [
          {name: 'airportTransfer', path: '/reservation-service/airport-transfer'}
        ]
      },
      {
        title: '预约上门打包',
        id: 54,
        icon: 'solution',
        key: '/reservation-service/appointment-info',
        components: [
          {name: 'appointmentInfo', path: '/reservation-service/appointment-info'}
        ]['appointmentInfo']
      },
      {
        title: '全球跑腿预订',
        id: 55,
        icon: 'solution',
        testType: 'localTest',
        key: '/reservation-service/global-errands',
        components: [
          {name: 'GlobalErrands', path: '/reservation-service/global-errands'},
          {name: 'EditProgress', path: '/reservation-service/global-errands/edit-progress'}
        ]
      }
    ]
  },
  {
    title: '商品管理',
    icon: 'shop',
    id: 25,
    key: '/commodities-manage',
    subs: [
      {
        title: '商品资料库',
        id: 43,
        icon: 'database',
        key: '/commodities-manage/commodities-database',
        components: [
          {name: 'commoditiesDataBase', path: '/commodities-manage/commodities-database'},
          {name: 'commoditiesCreateAndEdit', path: '/commodities-manage/commodities-database/create-and-edit'},
          {name: 'commoditiesImgList', path: '/commodities-manage/commodities-database/commodities-img-list'}
        ]
      }
    ]
  },
  // 本地专用
  {
    title: '开发人员专用',
    id: 42,
    icon: 'like',
    testType: 'localTest',
    key: '/developer-pages',
    subs: [
      {
        title: '导入excel',
        id: 44,
        icon: 'file-excel',
        key: '/developer-pages/import-excel',
        components: [
          {name: 'importExcel', path: '/developer-pages/import-excel'}
        ]
      }
    ]
  }
];

export default menus;