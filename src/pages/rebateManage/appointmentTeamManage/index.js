import React from 'react';
import { Radio, Table, Button, Modal, message, } from 'antd';

import './index.less'

class appointmentTeamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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