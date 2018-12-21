import React from 'react';

const columns = [{
  title: '预约时间',
  dataIndex: 'expectTime',
  key: 'expectTime',
  width: 100,
}, {
  title: '预约件数',
  dataIndex: 'expectNumber',
  key: 'expectNumber',
  width: 80,
}, {
  title: '航班号',
  dataIndex: 'flightNumber',
  key: 'flightNumber',
  width: 80,
},  {
  title: '仓库名称',
  dataIndex: 'warehouseName',
  key: 'warehouseName',
  width: 120,
}, {
  // title: '用户名(预约人)',
  title: '用户名',
  dataIndex: 'nickName',
  key: 'nickName',
  width: 100,
}, {
  title: '服务区域类型',
  dataIndex: 'packArea',
  key: 'packArea',
  width: 120,
}, {
  title: '附近商场',
  dataIndex: 'shop',
  key: 'shop',
  width: 100,
}, {
  title: '用户手机号',
  dataIndex: 'userPhone',
  key: 'userPhone',
  width: 120,
}, {
  title: '是否打包',
  dataIndex: 'isPack',
  key: 'isPack',
  width: 70,
  render: (text, record) => (  //塞入内容
    <div>{record.isPack===1 ? "是":(record.isPack===0 ? "否":"")}</div>
  ),
}];

export default columns;