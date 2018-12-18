import React from 'react';
import {Table,Button} from 'antd';
import './index.less';

const columns = [{
  title: '预约时间',
  dataIndex: 'expectTime',
  key: 'expectTime',
}, {
  title: '预约件数',
  dataIndex: 'expectNumber',
  key: 'expectNumber',
}, {
  title: '航班号',
  dataIndex: 'flightNumber',
  key: 'flightNumber',
},  {
  title: '仓库名称',
  dataIndex: 'warehouseName',
  key: 'warehouseName',
}, {
  title: '用户名(预约人)',
  dataIndex: 'nickName',
  key: 'nickName',
}, {
  title: '服务区域类型',
  dataIndex: 'packArea',
  key: 'packArea',
}, {
  title: '附近商场',
  dataIndex: 'shop',
  key: 'shop',
}, {
  title: '用户手机号',
  dataIndex: 'userPhone',
  key: 'userPhone',
}, {
  title: '是否打包',
  dataIndex: 'isPack',
  key: 'isPack',
  render: (text, record) => (  //塞入内容
    <span>{record.isPack===1 ? "是":(record.isPack===0 ? "否":"")}</span>
  ),
}];
class appointmentInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      selection:0
    };
  }
  componentWillMount() {
    this.setState({selection:0});
    this.allInformation();
  }
  allInformation (){
    fetch("http://api.maishoumiji.com/appointment/getAppointmentList",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res})
    })
  }
  allBook (){
    this.setState({selection:0});
    this.allInformation()
  }
  airport (){
    fetch("http://api.maishoumiji.com//appointment/getAppointmentByisFlight",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res,selection:1})
    })
  }
  render() {
    return (
      <div className="appointmentInfo">
        <Button  className="election" type={this.state.selection===0 ? "primary":""} onClick={this.allBook.bind(this)}>全部</Button ><Button className="election" type={this.state.selection===1 ? "primary":""} onClick={this.airport.bind(this)}>接机</Button>
        <Table dataSource={this.state.dataSource} columns={columns} bordered rowKey={(record, index) => `complete${record.boxCode}${index}`}></Table>
      </div>
    )
  }
}

export default appointmentInfo;