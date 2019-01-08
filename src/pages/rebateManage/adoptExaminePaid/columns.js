import React from 'react';

const columns=[{
  title: '申请人',
  dataIndex: 'wechatName',
  key: 'wechatName',
}, {
  title: '申请金额',
  dataIndex: 'returnedMoney',
  key: 'returnedMoney',
}, {
  title: '到账金额',
  dataIndex: 'realReturnedMoney',
  key: 'realReturnedMoney',
  render: (text, record) => (  //塞入内容
    <div className={"ellipsis"} >{(record.returnedMoney*0.99).toFixed(2)}</div>
  ),
}];

export default columns;