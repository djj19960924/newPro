import React from 'react';
import {Table,Button } from 'antd';
import './index.less';
import columns from './columns';

class appointmentInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selection: 0,
    };
  }
  componentWillMount() {
    this.setState({selection:0});
    this.allInformation();
  }
  allInformation() {
    fetch("http://api.maishoumiji.com/appointment/getAppointmentList",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(r => r.json()).then(r=>{
      this.setState({
        dataSource: r,
      });
    })
  }
  allBook (){
    this.setState({selection:0});
    this.allInformation()
  }
  airport (){
    fetch("http://api.maishoumiji.com/appointment/getAppointmentByisFlight",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then(r=>{
      this.setState({dataSource:r,selection:1})
    })
  }
  render() {
    return (
      <div className="appointmentInfo">
        <p className="topBtn">
          <Button className="election"
                  type={this.state.selection===0 ? "primary":""}
                  onClick={this.allBook.bind(this)}
          >全部</Button >
          <Button className="election"
                  type={this.state.selection===1 ? "primary":""}
                  onClick={this.airport.bind(this)}
          >接机</Button>
        </p>
        <Table className="tableList"
               dataSource={this.state.dataSource}
               columns={columns}
               bordered
               rowKey={(record, index) => `id_${index}`}
               scroll={{
                 x: 1000,
                 y: 600
               }}
               pagination={{
                 // pageSizeOptions: ['10','30','100'],
                 // showSizeChanger: true,
                 defaultCurrent: 1,
                 defaultPageSize: 30,
               }}
        />
      </div>
    )
  }
}

export default appointmentInfo;