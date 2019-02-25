import React from 'react';
import { Radio, Table, Pagination, message, } from 'antd';

import './index.less';

class airportTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTotal: 0,
      pageSize: 30,
      pageNum: 1,
    };
    window.airportTransfer = this;
  }

  componentDidMount() {
    // 组件加载成功时
    this.getAirportDropInfo();
  }

  // 获取送机用户信息
  getAirportDropInfo(pageNum=this.state.pageNum, pageSize=this.state.pageSize, payment=this.state.payment) {
    fetch(window.apiUrl+'/airportManagement/getAirportDropInfo',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`pageNum=${pageNum}&pageSize=${pageSize}`
    }).then(r => r.json()).then(r => {
      console.log(r);
      if (r.status) {
        if (r.status === 10000) {
        } else {
          message.error(`${r.msg}, 错误码:${r.status}`)
        }
      } else {
        message.error(`后端数据错误`)
      }
    }).catch(r => {
      message.error(`前端接口调用错误: 获取送机用户信息接口调取失败`)
    })
  }

  // 改变每页尺寸
  changePageSize(pageNum,pageSize) {
    console.log(pageNum,pageSize);
    // this.getProgramUserPaied(pageNum,pageSize)
  }
  // 翻页事件
  changePage(pageNum,pageSize) {
    console.log(pageNum,pageSize);
    // this.getProgramUserPaied(pageNum,pageSize)
  }

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const { pageTotal, pageSize, pageNum, } = this.state;
    const columns = [];
    return (
      <div className="airportTransfer">
        <RadioGroup defaultValue={0}
                    buttonStyle="solid"
                    className="radioBtn"
                    // onChange={{this.changeStatus.bind(this)}
        >
          <RadioButton value={0}>接机用户信息</RadioButton>
          <RadioButton value={1}>送机用户信息</RadioButton>
        </RadioGroup>
        <Table className="tableList"
               // dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ x: 800, y: 500 }}
               rowKey={(record, index) => `id_${index}`}
        />
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePageSize.bind(this)}
        />
      </div>
    )
  }
}

export default airportTransfer;