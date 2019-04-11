import React from 'react';
import {Table , Button} from 'antd';
import XLSX from 'xlsx';
import './index.less';

class orderNotPushed extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    tableIsLoading: false,
  }

  render() {
    return (
      <div className="orderNotPushed">

      </div>
    );
  }

}

export default orderNotPushed;