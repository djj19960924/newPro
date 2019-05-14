import React from 'react';
import { Table, Button, Pagination, message, } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import './index.less';

class orderNotPushed extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 表单数据
      tableDataList: [],
      // 表单加载状态
      tableIsLoading: false,
      // 按钮加载状态
      updateBtnIsLoading: false,
      // 所选数据数组
      selectedList: [],
      // 所选行数数组
      selectedIds: [],
      // 分页相关
      pageTotal: 0,
      pageNum: 1,
      pageSize: 100,
      pageSizeOptions: [`50`,`100`,`200`,`300`]
    };
    // console.log(new.target.name)
    // window.orderNotPushed = this;
  }
  componentDidMount() {
    this.sendToPostal();
  }
  // 查看需要推送到邮政的包裹信息
  sendToPostal(
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) {
    this.setState({tableIsLoading: true});
    let clearTable = () => this.setState({tableIsLoading:false,selectedIds:[],selectedList:[]});
    fetch(`${window.fandianUrl}/postalManagement/sendToPostal`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({pageNum:pageNum,pageSize:pageSize})
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
      this.sendToPostal();
    })
  }

  // 导出excel并更新状态
  updateStatusByBoxCode() {
    const { selectedList, } = this.state;
    if (selectedList.length > 0) {
      // 导出excel模板
      let elt = document.getElementById('tableListForExport');
      let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
      XLSX.writeFile(wb, `邮政推送订单 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);
      this.setState({updateBtnIsLoading:true});
      // 制作数据
      let dataList = [];
      for (let v of selectedList) dataList.push(v.boxCode);
      // 接口调取
      fetch(`${window.fandianUrl}/postalManagement/updateStatusByBoxCode`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataList)
      }).then(r => r.json()).then(r => {
        if (!r.msg && !r.data) {
          message.error(`后端数据错误`);
        } else {
          if (r.status === 10000) {
            message.success(r.msg);
            this.sendToPostal();
          } else {
            message.error(`${r.msg} 错误码:${r.status}`)
          }
        }
        this.setState({updateBtnIsLoading:false});
      }).catch(()=>{
        message.error(`前端接口调取失败`);
        this.setState({updateBtnIsLoading:false});
      })
    } else {
      message.error(`请选择订单`)
    }
  }

  render() {
    const { tableDataList, tableIsLoading, selectedIds, pageTotal, pageSize, pageNum, pageSizeOptions, selectedList, updateBtnIsLoading, } = this.state;
    const columns = [
      {title: `箱号`, dataIndex: `boxCode`, key: 'boxCode', width: 180},
      {title: `收件人`, dataIndex: `recipientsName`, key: 'recipientsName', width: 140},
      {title: `收件号码`, dataIndex: `recipientsPhone`, key: 'recipientsPhone', width: 140},
      {title: `重量(KG)`, dataIndex: `boxKg`, key: 'boxKg', width: 90},
      {title: `收件地址`, dataIndex: `recipientsAddress`, key: 'recipientsAddress'},
    ];
    return (
      <div className="orderNotPushed">
        <p className="title">邮政 - 未推送订单</p>

        <div className="btnLine">
          <Button type="primary"
                  onClick={this.updateStatusByBoxCode.bind(this)}
                  disabled={selectedList.length === 0}
                  loading={updateBtnIsLoading}
          >推送所选订单</Button>
        </div>

        {/*导出用表单*/}
        <Table className="tableListForExport"
               id="tableListForExport"
               pagination={false}
               columns={columns}
               dataSource={selectedList}
               style={{display:`none`}}
               rowKey={(record, index) => `${index}`}
        />

        {/*表单主体*/}
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               loading={tableIsLoading}
               bordered
               rowSelection={{
                 selectedRowKeys: selectedIds,
                 // 选择框变化时触发
                 onChange: (selectedRowKeys, selectedRows) => {
                   console.log(selectedRowKeys, selectedRows);
                   this.setState({
                     selectedIds: selectedRowKeys,
                     selectedList: selectedRows,
                   });
                 },
               }}
               scroll={{ y: 600, x: 900 }}
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

export default orderNotPushed;