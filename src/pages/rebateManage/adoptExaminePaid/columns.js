import React from 'react';
import moment from 'moment';

const columns=[
  {
    title: '申请人',
    dataIndex: 'wechatName',
    key: 'wechatName',
  },
  {
    title: '申请金额',
    dataIndex: 'returnedMoney',
    key: 'returnedMoney',
    width: 150,
  },
  {
    title: '到账金额',
    dataIndex: 'realReturnedMoney',
    key: 'realReturnedMoney',
    width: 150,
    render: (text, record) => (  //塞入内容
      <div className={"ellipsis"} >{(record.returnedMoney*0.99).toFixed(2)}</div>
    ),
  },
  {
    title: '到账时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200,
    render: (text, record) => (  //塞入内容
      <div className={"ellipsis"} >{moment(record.updateTime).format('YYYY-MM-DD hh:mm:ss')}</div>
    ),
  }
];

export default columns;