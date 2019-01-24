import React from 'react';
import {Radio, Table, Pagination, Button, Link, Input, message, } from 'antd';
import XLSX$Consts from 'xlsx';

import './index.less';

class commoditiesDataBase extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 表单数据
      dataList: [],
      // 搜索字段
      searchValue: '',
      // 搜索备案类型
      record: 0,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
    };
    window.commoditiesDataBase = this;
  }
  // 默认读取表格
  componentWillMount() {
    // 默认载入表格数据
    this.getSku()
  }
  // 获取表单列表
  getSku(searchValue = this.state.searchValue,record = this.state.record,pageNum = this.state.pageNum,pageSize = this.state.pageSize) {
    fetch(`${window.apiUrl}/sku/getSku`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:`choice=${record}&name=${searchValue}&pageNum=${pageNum}&pageSize=${pageSize}`,
    }).then(r => r.json()).then(r => {
      // console.log(r.data.list)
      if (r.status === 10000) {
        this.setState({
          dataList: r.data.list,
          pageNum: r.data.pageNum,
          pageSize: r.data.pageSize,
          pageTotal: r.data.total,
        })
      } else if (r.status === 10001) {
        message.warn(`${r.msg}`);
        this.setState({dataList: []})
      } else {
        message.warn(`${r.msg} 状态码:${r.status}`);
        this.setState({dataList: []})
      }
    })
  }
  // 导出excel
  exportExcel () {
    var elt = document.getElementById('tableList');
    var wb = XLSX$Consts.utils.table_to_book(elt, {sheet:"Sheet JS"});
    // console.log(wb);
    XLSX$Consts.writeFile(wb, `商品资料库.xlsx`);
  }
  // 判断行邮方式
  postWay(q) {
    let way;
    switch (q) {
      case 0: way = '无'; break;
      case 1: way = 'ETK'; break;
      case 2: way = 'BC'; break;
      default : way = '数据错误'
    }
    return way;
  }
  // 更改是否已备案条件触发
  changeRecord(e) {
    // console.log(e.target.value)
    this.setState({
      record: e.target.value,
    });
    // 参数项设为 undefined 时, 将使用函数自带默认参数
    this.getSku(undefined, e.target.value)
  }
  // 更改当前页或每页显示条数
  changePage(n,s) {
    this.setState({
      pageNum: n,
      pageSize: s,
    });
    this.getSku(undefined,undefined,n,s)
  }
  // 跳转
  toCE(type,skuId) {
    // console.log(record);
    // 使用query传值
    // 在这里清空本地相关数据, 使得编辑和新增功能不受干扰
    localStorage.removeItem('imgList');
    localStorage.removeItem('newImgList');
    this.props.history.push(`/commodities-manage/commodities-database/create-and-edit?type=${type}&skuId=${skuId}`);
  }
  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    const { dataList, searchValue, pageNum, pageSize, pageTotal, } = this.state;
    const Search = Input.Search;
    // 表单头
    const columns = [
      {title: '商品名称', dataIndex: 'name', key: 'name', width: 160},
      {title: '毛重(kg)', dataIndex: 'grossWeight', key: 'grossWeight', width: 80},
      {title: '采购价', dataIndex: 'costPrice', key: 'costPrice', width: 120},
      {title: '商品品牌', dataIndex: 'brand', key: 'brand', width: 140},
      {title: '商品品类', dataIndex: 'category', key: 'category', width: 140},
      {title: '行邮方式', dataIndex: 'sugPostway', key: 'sugPostway', width: 100,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{this.postWay(record.sugPostway)}</div>
        ),
      },
      {title: '数量', dataIndex: 'stock', key: 'stock', width: 80},
      {title: 'etk备案价(¥)', dataIndex: 'recordPrice', key: 'recordPrice', width: 120,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.recordPrice ? record.recordPrice : '无'}</div>
        ),
      },
      {title: '税率', dataIndex: 'taxRate', key: 'taxRate', width: 80,
        render: (text, record) => (
          // 这里调用方法判断行邮方式
          <div>{record.taxRate ? record.taxRate : '无'}</div>
        ),
      },
      {title: '操作', dataIndex: '操作', key: '操作',
        // width: 100,
        // fixed: 'right',
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin':0}}
                    onClick={this.toCE.bind(this,'edit',record.skuId)}
            >编辑</Button>
          </div>
        ),
      }
    ];
    return (
      <div className="dataBase">
        {/*查询条件单选行*/}
        <RadioGroup defaultValue={0}
                    buttonStyle="solid"
                    className="radioBtn"
                    onChange={this.changeRecord.bind(this)}
        >
          <RadioButton value={0}>全部</RadioButton>
          <RadioButton value={1}>已备案</RadioButton>
          <RadioButton value={2}>未备案</RadioButton>
        </RadioGroup>
        {/*新增按钮 excel导出 搜索框*/}
        <div className="searchLine">
          <Button type="primary"
                  className="createNew"
                  onClick={this.toCE.bind(this,'create',null)}
          >新增商品</Button>
          {/*<Button type="primary">excel导入</Button>*/}
          <Button type="primary"
                  className="exportExcel"
                  onClick={this.exportExcel.bind(this)}
          >excel导出</Button>
          <Search className="searchInput"
                  placeholder="请输入关键字进行搜索"
                  value={searchValue}
                  // onSearch={this.onSearch.bind(this)}
                  // 根据条件搜索
                  onSearch={(e) => this.getSku(e)}
                  // 保存搜索框值
                  onChange={(e) => this.setState({searchValue: e.target.value})}
          />
        </div>
        {/*表单主体*/}
        <Table className="tableList"
               id="tableList"
               ref={'commoditiesTable'}
               dataSource={dataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600, x: 1200 }}
               // style={{maxWidth: 1200}}
               rowKey={(record, index) => `id_${index}`}
        />
        {/*分页*/}
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) =>
                      `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                    }
                    style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePage.bind(this)}
        />
      </div>
    )
  }
}

export default commoditiesDataBase;