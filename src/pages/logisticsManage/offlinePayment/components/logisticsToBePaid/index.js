import React from "react";
import "./index.less"
import {Table, Pagination, Button, message, Modal, Radio} from "antd";
import moment from "moment";

class LogisticsToBePaid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNum: 1,
      pageSize: 50,
      dataSource: [],
      //总条数
      total: 0,
      tableLoading: false,
      pageSizeOptions: ["50", "200", "500", "1000"],
      //选择支付方式modal
      paymentMethodVisible: false,
      //订单号
      orderNum: null,
      //物流类别0 邮路/etk 1 BC  2 速跨通
      offLineType: null,
      //当前选择订单支付方式
      payType: null,
      //选择订单支付方式确定btn
      btnLoading: false
    };

  }


  componentWillMount() {
    this.getToBePaid();
  }

  getToBePaid(pageNum = this.state.pageNum, pageSize = this.state.pageSize) {
    const {pageSizeOptions} = this.state;
    this.setState({tableLoading: true});
    fetch(window.apiUrl + "/backendSpeedexpress/getOffLine", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({pageNum: pageNum, pageSize: pageSize, isPay: 0})
    }).then(r => r.json()).then(res => {
      this.setState({tableLoading: false});
      if (res.status === 10000) {
        if (res.data.total > pageSizeOptions[pageSizeOptions.length - 1]) {
          pageSizeOptions.push(res.data.total);
        }
        this.setState({dataSource: res.data.list, total: res.data.total});
      } else if (res.status === 10004) {
        message.warn(res.msg)
      } else if (res.status) {
        message.error(res.msg)
      } else {
        message.error("后端数据错误")
      }
    }).catch(() => {
      message.error("前端线下支付订单接口调取失败")
    })
  }

//修改pageNum,pageSize
  changePage(pageNum, pageSize) {
    this.getToBePaid(pageNum, pageSize);
    this.setState({pageNum: pageNum, pageSize: pageSize})
  }

//选择支付方式
  choosePayment() {
    const {offLineType, orderNum, payType} = this.state;
    if (payType || payType === 0) {
      this.setState({btnLoading: true});
      fetch(window.apiUrl + "/backendSpeedexpress/updateOffLine", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({offLineType: offLineType, code: orderNum, payType: payType})
      }).then(r => r.json()).then(res => {
        this.setState({
          btnLoading: false,
          paymentMethodVisible: false,
          orderNum: null,
          offLineType: null,
          payType: null
        });
        if (res.status === 10000) {
          this.getToBePaid();
        } else if (res.status) {
          message.error(res.msg);

        } else {
          message.error("后端数据错误")
        }
      }).catch(() => {
        message.error("选择支付方式接口调取失败")
      })
    } else {
      message.warn("请选择支付方式");
    }
  }

  render() {
    const columns = [{
      title: "订单时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 200,
      render: (text, record) => (
        <div>{record.createTime ? moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") : ""}</div>
      )
    }, {
      title: "业务类型",
      dataIndex: "offLineType",
      key: "offLineType",
      width: 150,
      render: (text, record) => (
        <div>{record.offLineType === 0 ? "邮路/ETK" : (record.offLineType === 1 ? "BC" : "速跨通")}</div>
      )
    }, {
      title: "订单号/箱号",
      dataIndex: "code",
      key: "code",
    }, {
      title: "用户昵称",
      dataIndex: "nickName",
      key: "nickName",
      width: 200
    }, {
      title: "需支付金额",
      dataIndex: "payMoney",
      key: "payMoney",
      width: 150
    }, {
      title: "操作",
      dataIndex: "pageNum",
      key: "pageNum",
      width: 150,
      render: (text, record) => (
        <div><Button type={"primary"} onClick={() => {
          this.setState({paymentMethodVisible: true, orderNum: record.code, offLineType: record.offLineType})
        }}>已支付</Button></div>
      )
    }
    ];
    const {dataSource, tableLoading, pageSize, pageSizeOptions, total, pageNum, paymentMethodVisible, btnLoading} = this.state;
    return (
      <div className="logistics-to-be-paid">
        <div className="tableMain">
          <Table className="tableList"
                 bordered
                 columns={columns}
                 dataSource={dataSource}
                 loading={tableLoading}
                 pagination={false}
                 rowKey={(record, index) => `${record.code}`}
                 scroll={{x: 1080, y: 600}}
          />
          <Pagination current={pageNum}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      showSizeChanger
                      total={total}
                      showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 `}共 ${total} 条记录`}
                      style={{float: 'right', marginRight: '20px', marginTop: '10px', marginBottom: '10px'}}
                      onChange={this.changePage.bind(this)}
                      onShowSizeChange={this.changePage.bind(this)}/>
        </div>
        <Modal title="请选择支付方式"
               closable={false}
               width={300}
               visible={paymentMethodVisible}
               destroyOnClose
               confirmLoading={btnLoading}
               wrapClassName={"paymentMethodModal"}
               onCancel={() => {
                 this.setState({paymentMethodVisible: false, orderNum: null, offLineType: null, payType: null})
               }}
               onOk={this.choosePayment.bind(this)}>
          <Radio.Group onChange={(e) => {
            this.setState({payType: e.target.value});
            console.log(e.target.value);
          }}>
            <Radio value={0}>支付宝</Radio>
            <Radio value={1}>银行卡</Radio>
            <Radio value={2}>微信</Radio>
            <Radio value={3}>现金</Radio>
          </Radio.Group>
        </Modal>
      </div>
    );
  }
}


export default LogisticsToBePaid;