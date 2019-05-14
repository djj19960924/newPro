import React from 'react';
import { Table, Button, Pagination, message, Input, } from 'antd';
import moment from 'moment';

import './index.less';

class globalTranshipmentNotArrived extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 表单数据
      tableDataList: [],
      // 物流单号搜索框
      searchParam: '',
      // 表单加载状态
      tableIsLoading: false,
      // 按钮加载
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
    }
  }
  componentDidMount() {
    this.isWareHouseParcelMessage();
  }
  // 后台根据仓库是否收货以及物流单号模糊查询
  isWareHouseParcelMessage(
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize,
    logistics = this.state.searchParam
  ) {
    this.setState({tableIsLoading: true});
    let clearTable = () => this.setState({tableIsLoading:false,selectedIds:[],selectedList:[]});
    fetch(`${window.fandianUrl}/parcelMessage/isWareHouseParcelMessage`,{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`pageNum=${pageNum}&pageSize=${pageSize}&isWareHouse=0&logistics=${logistics.trim()}`,
      credentials: 'include',
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
        } else if (r.status === 10001) {
          message.warn(`${r.msg}`);
          this.setState({
            tableDataList: [], pageTotal: 0,
            pageSizeOptions: [`50`,`100`,`200`,`300`]
          })
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
  // 根据id列表修改到仓状态
  updateParcelMessage() {
    const { selectedIds, } = this.state;
    this.setState({updateBtnIsLoading: true});
    fetch(`${window.fandianUrl}/parcelMessage/updateParcelMessage`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(selectedIds),
      credentials: 'include',
    }).then(r => r.json()).then(r => {
      if (!r.msg && !r.data) {
        message.error(`后端数据错误`);
      } else {
        if (r.status === 10000) {
          message.success(`${r.msg}`)
        } else {
          message.error(`${r.msg} 错误码:${r.status}`)
        }
      }
      this.setState({updateBtnIsLoading: false});
      this.isWareHouseParcelMessage();
    }).catch(()=>{
      message.error(`前端接口调取失败`);
      this.setState({updateBtnIsLoading: false});
    })
  }
  // 改变页码
  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{
      this.isWareHouseParcelMessage();
    })
  }
  render() {
    const { tableDataList, tableIsLoading, selectedIds, pageTotal, pageSize, pageNum, pageSizeOptions, updateBtnIsLoading, searchParam, } = this.state;
    const Search = Input.Search;
    const columns = [
      {title: `物流ID`, dataIndex: `id`, key: 'id', width: 90},
      {title: `物流单号`, dataIndex: `logistics`, key: 'logistics', width: 180},
      {title: `更新时间`, dataIndex: `updateTime`, key: 'updateTime', width: 180,
        render: (text, record) => (
          <div>{!!record.updateTime ?
            moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        )},
      {title: `包裹重量(kg)`, dataIndex: `weight`, key: 'weight', width: 90},
      {title: `微信号`, dataIndex: `wechatNo`, key: 'wechatNo'},
    ];
    return (
      <div className="globalTranshipmentNotArrived">
        <p className="title">全球转运 - 未到仓</p>
        <div className="btnLine">
          <Button type="primary"
                  className="updateParcelMessage"
                  onClick={this.updateParcelMessage.bind(this)}
                  disabled={selectedIds.length === 0}
                  loading={updateBtnIsLoading}
          >点击确认到仓</Button>
          <Search placeholder="输入物流单号"
                  className="searchInput"
                  onSearch={() => this.isWareHouseParcelMessage()}
                  value={searchParam}
                  onChange={e => this.setState({searchParam:e.target.value})}
                  style={{width: 200,marginLeft: 10}}
          />
        </div>
        <div className="main">
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
                     // console.log(selectedRowKeys, selectedRows);
                     this.setState({
                       selectedIds: selectedRowKeys,
                       selectedList: selectedRows,
                     });
                   },
                 }}
                 scroll={{ y: 600, x: 900 }}
                 rowKey={(record, index) => `${record.id}`}
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
      </div>
    )
  }
}

export default globalTranshipmentNotArrived;