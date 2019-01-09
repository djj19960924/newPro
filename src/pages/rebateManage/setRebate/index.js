import React from 'react';
import {Select, Button, Table, message, Pagination, } from 'antd';
import moment from 'moment';
import './index.less';

const Option = Select.Option;

class setRebate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 分页相关
      pageSize: 20,
      pageNum: 1,
      pageTotal: null,
      // 商场列表
      shopList: [],
      // 当前选择的商场
      currentShop: '',
      // 品牌列表
      tableDataList: [],
    };
  }
  // 加载商场列表
  componentWillMount() {
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST'
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        let dataList = [];
        for (let i of r.data) {
          dataList.push(<Option key={i.mallId} value={i.mallName}>{i.mallName}</Option>)
        }
        this.setState({
          shopList: dataList
        })
      } else {
        message.error(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      }
    })
  }
  // 选择商场触发
  selectShop(shopName,target) {
    let {pageSize} = this.state;
    this.selectAllRebateByMallName(1,pageSize,shopName)
  }
  // 根据商场获取品牌列表
  selectAllRebateByMallName(pageNum=this.state.pageNum,pageSize=this.state.pageSize,shopName=this.state.currentShop) {
    fetch(window.fandianUrl + '/rebate/selectAllRebateByMallName', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: `mallName=${shopName}&pageSize=${pageSize}&pageNum=${pageNum}`,
    }).then(r => r.json()).then(r => {
      // console.log(r)
      if (r.status === 10000) {
        this.setState({
          currentShop: shopName,
          pageTotal: r.data.total,
          pageSize: r.data.pageSize,
          pageNum: r.data.pageNum,
          tableDataList: r.data.list,
        })
      }
    })
  }
  // 分页操作
  changePage(pageNum,pageSize) {
    // console.log(pageNum,pageSize)
    this.selectAllRebateByMallName(pageNum,pageSize)
  }
  changePageSize(pageNum,pageSize) {
    // console.log(pageNum,pageSize)
    this.selectAllRebateByMallName(pageNum,pageSize)
  }
  // 打开编辑弹窗
  openEdit(q) {
    console.log('edit',q)
  }
  // 打开新增弹窗
  openCreate() {
    console.log('create')
  }
  render() {
    // 表单标题
    const columns=[
      {title: '商场', dataIndex: 'mallName', key: 'mallName', width: 160},
      {title: '品牌', dataIndex: 'brandName', key: 'brandName', },
      {title: '商品码', dataIndex: 'productCode', key: 'productCode', width: 80},
      {title: '最近更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 200,
      render: (text, record) => (
          <div>{moment(record.updateTime).format('YYYY-MM-DD hh:mm:ss')}</div>
      )
      },
      {title: '返点率', dataIndex: 'rebateRate', key: 'rebateRate', width: 100},
      {title: '操作', dataIndex: '操作', key: '操作', width: 150,
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin':0}}
                    onClick={this.openEdit.bind(this,record)}
            >编辑</Button>
          </div>
        ),
      }
    ];
    const {shopList, tableDataList, pageTotal, pageSize, pageNum, } = this.state;
    return (
      <div className="setRebate">
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
        </div>
        <div className="btnLine">
          <Button className="createNew" type="primary"
                  onClick={this.openCreate.bind(this)}
          >新增品牌</Button>
        </div>
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600 }}
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

export default setRebate;