import React from "react";
import "./index.less";
import {Table, Button, Modal, message, Input} from "antd"

class ExchangeRate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editRateVisible: false,
      //使用币种
      currency: null,
      //兑换币种
      rateCurrency: null,
      //当前选择的汇率
      rate: null,
      //汇率Id
      rateId: null,
      //编辑确定loading
      editConfirmLoading: false,
      //表格加载
      tableLoading: false
    };

  }

  componentWillMount() {
    this.getCurrencyRate();
  }

//获取汇率列表
  getCurrencyRate() {
    this.setState({tableLoading: true});
    fetch(window.apiUrl + "/backendRate/getRateList", {
      method: "post",
      headers: {"Content-Type": "application/json"},
    }).then(r => r.json()).then(res => {
      this.setState({tableLoading: false});
      if (res.status === 10000) {
        this.setState({dataSource: res.data})
      } else if (res.status) {
        message.error(res.msg);
      } else {
        message.error("后端数据错误");
      }
    }).catch(r => {
      message.error(`前端错误: 获取汇率接口调取错误`);
    })
  }

//修改汇率
  editRate() {
    const {rateId, rate} = this.state;
    this.setState({editConfirmLoading: true});
    fetch(window.apiUrl + "/backendRate/updateRate", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: rateId, rate: rate})
    }).then(r => r.json()).then(res => {
      this.setState({editConfirmLoading: false})
      if (res.status === 10000) {
        this.getCurrencyRate();
        this.setState({currency: "", rateCurrency: "", rate: "", rateId: "", editRateVisible: false})
      } else if (res.status) {
        message.error(res.msg)
      } else {
        message.error("后端数据错误")
      }
    }).catch(r => {
      message.error(`前端错误: 修改汇率接口调取错误`);
    })
  }

  render() {
    const columns = [{
      title: "使用币种",
      dataIndex: "currency",
      key: "currency",
      width: 150
    }, {
      title: "兑换币种",
      dataIndex: "rateCurrency",
      key: "rateCurrency",
      width: 150
    }, {
      title: "汇率",
      dataIndex: "rate",
      key: "rate",
      width: 150
    }, {
      title: "编辑",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (text, record) => (
        <div>
          <Button type={"primary"}
                  onClick={() => {
                    this.setState({
                      editRateVisible: true,
                      currency: record.currency,
                      rateCurrency: record.rateCurrency,
                      rate: record.rate,
                      rateId: record.id
                    })
                  }}>编辑</Button>
        </div>
      )
    }];
    const {dataSource, editRateVisible, currency, rateCurrency, rate,editConfirmLoading,tableLoading} = this.state;
    return (
      <div className="exchange-rate">
        <div className="title">
          <div className="titleMain">汇率</div>
          <div className="titleLine"></div>
        </div>
        <Button type={"primary"} className="add-rate-btn">新增汇率</Button>
        <div className="tableMain">
          <Table className="tableList"
                 bordered
                 dataSource={dataSource}
                 columns={columns}
                 loading={tableLoading}
                 pagination={false}
                 scroll={{x: 550, y: 800}}
                 rowKey={(record, index) => `${record.id}`}/>
        </div>

        <Modal title="是否修改汇率"
               closable={false}
               destroyOnClose
               width={300}
               confirmLoading={editConfirmLoading}
               visible={editRateVisible}
               wrapClassName="exchange-rate-modal"
               onOk={this.editRate.bind(this)}
               onCancel={() => {
                 this.setState({currency: "", rateCurrency: "", rate: "", rateId: "", editRateVisible: false})
               }}>
          <div className="rate-info">
            <p>使用币种 : </p>
            <p className="currency">{currency}</p>
          </div>
          <div className="rate-info">
            <p>兑换币种 : </p>
            <p className="currency">{rateCurrency}</p>
          </div>
          <div className="rate-info">
            <p className="rate">汇率 :</p>
            <Input placeholder="请输入汇率" value={rate} onChange={(e) => {
              this.setState({rate: e.target.value})
            }}/>
          </div>
        </Modal>
      </div>
    );
  }
}


export default ExchangeRate;