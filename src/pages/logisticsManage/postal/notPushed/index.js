import React from 'react';
import {Table , Button} from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import './index.less';

class orderNotPushed extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    tableIsLoading: false,
  };
  updateStatusByBoxCode() {
    // 导出excel模板
    let elt = document.getElementById('tableListForExport');
    let wb = XLSX.utils.table_to_book(elt, {raw: true, sheet: "Sheet JS"});
    XLSX.writeFile(wb, `邮政推送订单 ${moment(new Date()).format('YYYY-MM-DD_HH.mm.ss')}.xlsx`);

  }

  render() {
    return (
      <div className="orderNotPushed">

      </div>
    );
  }

}

export default orderNotPushed;