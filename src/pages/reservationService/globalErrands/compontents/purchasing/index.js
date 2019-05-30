import React from "react";
import {Table, Button, message, Modal, Pagination, Input, Radio} from "antd";
import moment from "moment";
import XLSX from 'xlsx';
import "./index.less";


class WaitPurchasing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //订单总量
      orderTotal: 0,
      pageNum: 1,
      pageSize: 50,
      pageSizeOptions: ["50", "100", "500", "1000"],
      //表格数据
      dataSource: [],
      //表格加载loading
      tableLoading: false,
      //当前选择的订单id
      orderId: null,
      //完结订单modal
      endVisible: false,
      //完结订单状态(1 购完 0 退款)
      endState: 1,
      //未采购到的商品名称
      noPurchased: null,
      //结单按钮loading
      btnLoading: false
    };

  }

  componentWillMount() {
    this.getOrderInfo();
  }

  //获取表格数据
  getOrderInfo(pageNum = this.state.pageNum, pageSize = this.state.pageSize, searchParm = this.state.searchParm) {
    let data = {
      isEnd: 0,
      pageNum: pageNum,
      pageSize: pageSize,
      searchParm: searchParm
    };
    this.setState({tableLoading: true});
    fetch(window.apiUrl + "/legworkBackend/getLegworkByIsEnd", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(r => r.json()).then(res => {
        this.setState({tableLoading: false});
        if (res.status === 10000) {
          message.success(res.msg);
          this.setState({dataSource: res.data.list, orderTotal: res.data.total});
          if (res.data.total > this.state.pageSizeOptions[this.state.pageSizeOptions.length - 1]) {
            let pageSizeOptions = this.state.pageSizeOptions;
            pageSizeOptions.push(res.data.total.toString());
            this.setState({pageSizeOptions: pageSizeOptions});
          }
        } else if (res.status === 10004) {
          message.warn(res.msg);
          this.setState({dataSource: [], orderTotal: 0});
        } else {
          message.error(res.msg);
          this.setState({dataSource: [], orderTotal: 0});
        }
      }
    ).catch(r => {
      this.setState({tableLoading: false});
      console.error(r);
      console.log('前端接口调取错误')
    })
  }

  //编辑订单
  editOrder(id) {
    this.props.history.push("/reservation-service/global-errands/edit-progress?id=" + id);
  }

  //显示完结订单modal
  endOrder(id) {
    this.setState({orderId: id, endVisible: true})
  }

//选择结单原因
  statementReason(e) {
    if (e.target.value === 1) {
      this.setState({noPurchased: null});
    }
    this.setState({endState: e.target.value});
  }

//获取未采购商品名称
  getNoPurchasedInfo(e) {
    this.setState({noPurchased: e.target.value});
  }

//订单完结确定
  confirmOk() {
    const {orderId, endState, noPurchased} = this.state;
    if (endState === 0 && !noPurchased) {
      message.warn("请填写未采购商品名");
    } else if (!orderId) {
      message.error("订单错误,请重新选择订单");
      this.setState({orderId: null, endVisible: false, endState: 1, noPurchased: null});
    }else{
      this.setState({btnLoading: true});
      fetch(window.apiUrl + "/legworkBackend/setLegworkIsEnd", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: orderId,choice:endState,unpurchasedProductName:noPurchased})
      }).then(r => r.json()).then(res => {
        this.setState({btnLoading: false});
        if (res.status === 10000) {
          message.success(res.msg);
          this.setState({orderId: null, endVisible: false, endState: 1, noPurchased: null});
          this.getOrderInfo();
        } else if (res.status === 10004) {
          message.warn(res.msg);
        } else {
          message.error(res.msg);
        }
      }).catch(r => {
        this.setState({tableLoading: false});
        console.error(r);
        console.log('前端接口调取错误')
      })
    }

  }

  //订单完结取消
  endCancel() {
    this.setState({orderId: null, endVisible: false})
  }

//改变pageNum,pageSize
  changePage(pageNum, pageSize) {
    this.setState({pageNum: pageNum, pageSize: pageSize}, function () {
      this.getOrderInfo(pageNum, pageSize);
    })
  }

  //导出
  exportInfo() {
    let elt = document.getElementById('exportTable');
    let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, `采购信息 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);
  }

  render() {
    const columns = [
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        width: 150,
        render: (text, record) => (
          <div>
            <Button type="primary" onClick={this.editOrder.bind(this, record.id)}>编辑</Button>
            <Button onClick={this.endOrder.bind(this, record.id)} style={{
              "marginLeft": 10,
              "backgroundColor": "#e2bc14",
              "color": "#fff",
              "borderColor": "transparent"
            }}>订单完结</Button>
          </div>
        )
      },
      {
        title: "最近进度更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        width: 150,
        render: (text, record) => (
          <div>{moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
      },
      {
        title: "预订时间",
        dataIndex: "createTime",
        key: "createTime",
        width: 150,
        render: (text, record) => (
          <div>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
      },
      {
        title: "微信号",
        dataIndex: "wechatNo",
        key: "wechatNo",
        width: 150
      },
      {
        title: "商品内容",
        dataIndex: "productName",
        key: "productName",
        width: 150
      }
    ];
    const exportColumns = [
      {
        title: "预订时间",
        dataIndex: "createTime",
        key: "createTime",
        width: 150,
        render: (text, record) => (
          <div>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
      },
      {
        title: "微信号",
        dataIndex: "wechatNo",
        key: "wechatNo",
        width: 150
      },
      {
        title: "商品内容",
        dataIndex: "productName",
        key: "productName",
        width: 150
      }
    ];
    const {dataSource, tableLoading, endVisible, pageNum, pageSize, pageSizeOptions, orderTotal, endState, noPurchased,btnLoading} = this.state;
    const Search = Input.Search;
    return (
      <div className="wait-purchasing">
        <Button type={"primary"} disabled={dataSource.length === 0} style={{"marginLeft": 10}}
                onClick={this.exportInfo.bind(this)}>导出等待采购信息</Button>
        <Search className="searchInput" placeholder="输入关键字搜索" onSearch={value => {
          this.getOrderInfo(undefined, undefined, value);
          this.setState({searchParm: value})
        }}/>
        {/*导出*/}
        <Table id="exportTable"
               columns={exportColumns}
               dataSource={dataSource}
               pagination={false}
               style={{display: `none`}}
               rowKey={(record, index) => `${record.id}`}
        />
        <Table bordered
               columns={columns}
               dataSource={dataSource}
               pagination={false}
               loading={tableLoading}
               rowKey={(record, index) => `${record.id}`}
               scroll={{x: 960, y: 600}}
        />
        <Pagination current={pageNum}
                    pageSize={pageSize}
                    pageSizeOptions={pageSizeOptions}
                    showSizeChanger
                    showTotal={(total, range) => `${range[1] === 0 ? "" : ` 当前为第${range[1]}-${range[0]}条 `}共${total}条记录`}
                    style={{float: 'right', marginRight: 20, marginTop: 10,marginBottom:20}}
                    total={orderTotal}
                    onChange={this.changePage.bind(this)}
                    onShowSizeChange={this.changePage.bind(this)}
        />
        <Modal title="请确认"
               centered
               destroyOnClose
               wrapClassName="globalErrandsModal"
               visible={endVisible}
               closable={false}
               footer={[
                 <Button type="primary" key="ok"  loading={btnLoading} onClick={this.confirmOk.bind(this)}>确认结单</Button>,
                 <Button key="cancel" onClick={this.endCancel.bind(this)}>取消</Button>
               ]}
        >
          <Radio.Group defaultValue={1} onChange={this.statementReason.bind(this)}>
            <Radio value={1}>本次所有商品已经采购到</Radio>
            <Radio value={0}>本次商品未采购完，可线下申请退款</Radio>
          </Radio.Group>
          <Input.TextArea autosize={true} disabled={endState !== 0} placeholder="请输入未采购到的商品名称" value={noPurchased}
                          onChange={this.getNoPurchasedInfo.bind(this)}/>
        </Modal>
      </div>
    );
  }
}


export default WaitPurchasing;