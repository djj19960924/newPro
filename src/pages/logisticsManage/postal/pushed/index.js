import React from 'react';
import { Table, Pagination, message, } from 'antd';
import XLSX from 'xlsx';
import './index.less';

class orderPushed extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tableDataList: [],
      tableIsLoading: false,
      pageTotal: 0,
      pageSize: 100,
      pageNum: 1,
      pageSizeOptions: [`50`,`100`,`200`,`300`]
    }
  }
  componentDidMount() {
    this.getPostalLogisticInfo();
  }

  // 查看需要推送到邮政的包裹信息
  getPostalLogisticInfo(
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) {
    this.setState({tableIsLoading: true});
    let clearTable = () => this.setState({tableIsLoading:false});
    fetch(`${window.fandianUrl}/postalManagement/getPostalLogisticInfo`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({pageNum:pageNum,pageSize:pageSize}),
    }).then(r => r.json()).then(r => {
      // console.log(r);
      if (!r.msg && !r.data) {
        message.error(`后端数据错误`);
      } else {
        if (r.status === 10000) {
          this.setState({
            tableDataList: r.data.list, pageTotal: r.data.total,
            pageSizeOptions: [`50`,`100`,`200`,`${r.data.total > 300 ? r.data.total : 300}`]
          })
        } else if (r.status < 10000) {
          message.warn(`${r.msg}`)
        } else {
          message.error(`${r.msg} 错误码:${r.status}`)
        }
      }
      clearTable();
    }).catch(()=>{
      message.error(`前端接口调取失败`);
      clearTable();
    })
  }

  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{
      this.getPostalLogisticInfo();
    })
  }

  render() {
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, } = this.state;
    const columns = [
      {title: `箱号`, dataIndex: `boxCode`, key: 'boxCode', width: 180},
      {title: `运单号`, dataIndex: `waybillNo`, key: 'waybillNo', width: 140},
      {title: `收件人`, dataIndex: `recipientsName`, key: 'recipientsName', width: 140},
      {title: `收件号码`, dataIndex: `recipientsPhone`, key: 'recipientsPhone', width: 140},
      {title: `重量(KG)`, dataIndex: `boxKg`, key: 'boxKg', width: 90},
      {title: `收件地址`, dataIndex: `recipientsAddress`, key: 'recipientsAddress'},
    ];
    return (
      <div className="orderPushed">
        <p className="title">邮政 - 已推送订单</p>

        {/*表单主体*/}
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               loading={tableIsLoading}
               bordered
               scroll={{ y: 600, x: 1000 }}
               rowKey={(record, index) => `${index}`}
        />
        {/*分页*/}
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) =>
                      `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                    }
                    style={{float:'right',marginRight:20,marginTop:10,marginBottom: 20}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={pageSizeOptions}
                    onShowSizeChange={this.changePage.bind(this)}
        />
      </div>
    );
  }

}

export default orderPushed;