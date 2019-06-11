import React from 'react';
import {Table , Button} from 'antd';
import './index.less';
import XLSX$Consts from 'xlsx';

class orderMatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tableList:[]
    };
  }
  componentDidMount() {
    // this.ajax.post('/box/getUploadBoxOrder').then(r => {
    //   if (r.data.status === 10000) {
    //     this.setState({dataSource:r})
    //   }
    //   r.showError();
    // }).catch(r => {
    //   console.error(r);
    //   this.ajax.isReturnLogin(r, this);
    // });
    // return false;
    fetch(window.apiUrl+"/box/getUploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(response=>response.json()).then(r=>{
      this.setState({dataSource:r})
    })
  }
  doit () {
    var elt = document.getElementById('table');
    var wb = XLSX$Consts.utils.table_to_book(elt, {raw: true, sheet:"Sheet JS"});
    XLSX$Consts.writeFile(wb, (new Date()+'已匹配订单.xlsx'));
  }
  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  render() {
    const columns = [
      {title: '客户订单号', dataIndex: 'boxCode', key: 'boxCode', width: 120},
      {title: '寄件人', dataIndex: 'sender', key: 'sender', width: 100},
      {title: '寄件人电话号码', dataIndex: 'senderPhone', key: 'senderPhone', width: 100},
      {title: '寄件人邮编', dataIndex: 'senderPostcode', key: 'senderPostcode', width: 70},
      {title: '寄件人地址', dataIndex: 'senderAddress', key: 'senderAddress', width: 100,
        render: (text, record) => (  //塞入内容
          <div className="ellipsis" style={{width: 79}} title={record.senderAddress}>{record.senderAddress}</div>
        ),
      },
      {title: '收件省/直辖市', dataIndex: 'recipientsProvince', key: 'recipientsProvince', width: 120},
      {title: '收件城市', dataIndex: 'recipientsCity', key: 'recipientsCity', width: 100},
      {title: '收件区域', dataIndex: 'recipientsDistrict', key: 'recipientsDistrict', width: 100},
      {title: '收件人', dataIndex: 'recipientsName', key: 'recipientsName', width: 100},
      {title: '收件人邮编', dataIndex: 'postcode', key: 'postcode', width: 70},
      {title: '收件人地址', dataIndex: 'recipientsAddress', key: 'recipientsAddress', width: 100},
      {title: '收件人电话号码', dataIndex: 'recipientsPhone', key: 'recipientsPhone', width: 110},
      {title: '实际重量', dataIndex: 'boxKg', key: 'boxKg', width: 60},
      {title: '原产地区', dataIndex: 'countryOrigin', key: 'countryOrigin', width: 60},
      {title: '是否代缴关税', dataIndex: 'hasPreaid', key: 'hasPreaid', width: 80,
        render: (text, record) => (  //塞入内容
          <span>{record.hasPreaid === 0 ? "否" : "是"}</span>
        ),
      },
      {title: '行邮税号', dataIndex: 'taxNumber', key: 'taxNumber', width: 100},
      {title: '物品名称', dataIndex: 'name', key: 'name', width: 80},
      {title: '规格型号', dataIndex: 'specification', key: 'specification', width: 80},
      {title: '物品数量', dataIndex: 'number', key: 'number', width: 80},
      {title: '计量单位', dataIndex: 'modelNumber', key: 'modelNumber', width: 80},
      {title: '物品单价', dataIndex: 'price', key: 'price', width: 80}
    ];
    const {tableList} = this.state;
    return (
      <div className="orderMatched">
        <div className="title">
          <div className="titleMain">ETK - 已匹配订单</div>
          <div className="titleLine" />
        </div>
        <Button className="election"
                onClick={this.doit.bind(this)}
        >导出Excel</Button>
        <Table className="tableList"
               id='table'
               dataSource={tableList}
               columns={columns}
               bordered
               rowKey={(record, index) => `id:${record.boxCode}${index}`}
               scroll={{x: 1800, y: 600}}
               pagination={false}
        />
      </div>
    )
  }
}

export default orderMatched;