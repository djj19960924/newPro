import React from 'react';
import {Radio, Table, Pagination, } from 'antd';
import './index.less';

import columns from './columns';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class adoptExaminePaid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      payment: 2,
      pageNum: 1,
      pageSize: 10,
      pageTotal: null,
    };
  }
  componentWillMount() {
    this.getProgramUserPaied()
  }
  // 获取已打款信息
  getProgramUserPaied(pageNum=this.state.pageNum,pageSize=this.state.pageSize,payment=this.state.payment) {
    fetch(window.fandianUrl+'/programUser/getProgramUserPaied',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`payment=${payment}&pageNum=${pageNum}&pageSize=${pageSize}`
    }).then(r => r.json()).then(r => {
      // console.log(r)
      if (r.status===10000) {
        this.setState({
          dataList: r.data.list,
          pageTotal: r.data.total,
          pageSize: pageSize,
          pageNum: pageNum,
          payment: payment
        })
      }
    })
  }
  // ?payment=1&pageNum=1&pageSize=20
  changePaidMode(val) {
    // console.log(val.target.value)
    this.getProgramUserPaied(1,10,val.target.value)
  }
  // 改变每页尺寸
  changePageSize(pageNum,pageSize) {
    // console.log(pageNum,pageSize);
    this.getProgramUserPaied(pageNum,pageSize)
  }
  // 翻页事件
  changePage(pageNum,pageSize) {
    // console.log(pageNum,pageSize);
    this.getProgramUserPaied(pageNum,pageSize)
  }
  render() {
    const { dataList,} = this.state;
    return (
      <div className="adoptExaminePaid">
        <RadioGroup defaultValue={2}
                    buttonStyle="solid"
                    className="radioBtn"
                    onChange={this.changePaidMode.bind(this)}
        >
          <RadioButton value={2}>提现到支付宝</RadioButton>
          <RadioButton value={1}>提现到银行卡</RadioButton>
          <RadioButton value={3}>提现到微信</RadioButton>
        </RadioGroup>
        <Table className="tableList"
               dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               rowKey={(record, index) => `id_${index}`}
        />
        <Pagination className="tablePagination"
                    total={this.state.pageTotal}
                    pageSize={this.state.pageSize}
                    current={this.state.pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePageSize.bind(this)}
        />
      </div>
    )
  }
}

export default adoptExaminePaid;