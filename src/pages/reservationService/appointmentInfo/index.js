import React from 'react';
import { Table, } from 'antd';
import './index.less';
import columns from './columns';

class appointmentInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }
  componentDidMount() {
    this.setState({selection:0});
    this.allInformation();
  }
  allInformation() {
    fetch(window.apiUrl+"/appointment/getAppointmentList",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(r => r.json()).then(r=>{
      this.setState({
        dataSource: r,
      });
    })
  }
  render() {
    return (
      <div className="appointmentInfo">
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