import React from 'react';
import { Table, Pagination, message, Input, } from 'antd';
import moment from 'moment';

import './index.less';

class globalTranshipmentArrived extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 表单数据
      tableDataList: [],
      // 表单加载状态
      tableIsLoading: false,
      // 物流单号搜索框
      searchParam: '',
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
    let clearTable = () => this.setState({tableIsLoading:false});
    fetch(`${window.fandianUrl}/parcelMessage/isWareHouseParcelMessage`,{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`pageNum=${pageNum}&pageSize=${pageSize}&isWareHouse=1&logistics=${logistics.trim()}`
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
  // 改变页码
  changePage(pageNum, pageSize) {
    this.setState({
      pageNum: pageNum,
      pageSize: pageSize,
    },()=>{
      this.isWareHouseParcelMessage();
    })
  }
  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  render() {
    const { tableDataList, tableIsLoading, pageTotal, pageSize, pageNum, pageSizeOptions, searchParam,} = this.state;
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
      <div className="globalTranshipmentArrived">
        <p className="title">全球转运 - 已到仓</p>
        <div className="btnLine">
          <Search placeholder="输入物流单号"
                  className="searchInput"
                  onSearch={() => this.isWareHouseParcelMessage()}
                  value={searchParam}
                  onChange={e => this.setState({searchParam:e.target.value})}
                  style={{width: 200}}
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
      </div>
    )
  }
}

export default globalTranshipmentArrived;