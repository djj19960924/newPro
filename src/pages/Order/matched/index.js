import React from 'react';
import {Table , Button} from 'antd';

const columns=[{
  title: '客户订单号',
  dataIndex: 'boxCode',
  key: 'boxCode',
}, {
  title: '寄件人',
  dataIndex: 'sender',
  key: 'sender',
}, {
  title: '寄件人电话号码',
  dataIndex: 'senderPhone',
  key: 'senderPhone',
},  {
  title: '寄件人邮编',
  dataIndex: 'senderPostcode',
  key: 'senderPostcode',
}, {
  title: '寄件人地址',
  dataIndex: 'senderAddress',
  key: 'senderAddress',
}, {
  title: '收件省/直辖市',
  dataIndex: 'recipientsProvince',
  key: 'recipientsProvince',
}, {
  title: '收件城市',
  dataIndex: 'recipientsCity',
  key: 'recipientsCity',
}, {
  title: '收件区域',
  dataIndex: 'recipientsDistrict',
  key: 'recipientsDistrict',
}, {
  title: '收件人',
  dataIndex: 'recipientsName',
  key: 'recipientsName',
}, {
  title: '收件人邮编',
  dataIndex: 'postcode',
  key: 'postcode',
}, {
  title: '收件人地址',
  dataIndex: 'recipientsAddress',
  key: 'recipientsAddress',
}, {
  title: '收件人电话号码',
  dataIndex: 'recipientsPhone',
  key: 'recipientsPhone',
}, {
  title: '实际重量',
  dataIndex: 'boxKg',
  key: 'boxKg',
}, {
  title: '原产地区',
  dataIndex: 'countryOrigin',
  key: 'countryOrigin',
}, {
  title: '是否代缴关税',
  dataIndex: 'hasPreaid',
  key: 'hasPreaid',
  render: (text, record) => (  //塞入内容
    <span>{record.hasPreaid===0 ? "否":"是"}</span>
  ),
}, {
  title: '行邮税号',
  dataIndex: 'taxNumber',
  key: 'taxNumber',
}, {
  title: '物品名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '规格型号',
  dataIndex: 'specification',
  key: 'specification',
}, {
  title: '物品数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '计量单位',
  dataIndex: 'modelNumber',
  key: 'modelNumber',
}, {
  title: '物品单价',
  dataIndex: 'price',
  key: 'price',
}];

class orderMatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[]
    };
  }
  componentWillMount() {
    fetch("http://api.maishoumiji.com/box/getUploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.boxOrderList})
      console.log(res.boxOrderList);

    })
  }

  render() {
    return (
      <div className="orderMatched">
        <Table  dataSource={this.state.dataSource} columns={columns} bordered rowKey={(record, index) => `complete${record.boxCode}${index}`} ></Table>
      </div>
    )
  }
}

export default orderMatched;