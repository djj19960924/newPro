import React from 'react';
import { Radio, Table, Button, Modal, message, } from 'antd';

import './index.less'

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let status = 0;
    fetch(`http://192.168.3.32:8000/AppointmentMangement/getAppointmentByStatus`,{
      method: `POST`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `status=${status}`,
    }).then(r => r.json()).then(r => {
      console.log(r)
    })
  }

  render() {
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    return (
      <div className="appointmentTeamManage">
        预约挂团管理
      </div>
    )
  }
}

export default appointmentTeamManage;