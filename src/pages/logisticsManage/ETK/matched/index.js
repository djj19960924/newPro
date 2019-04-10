import React from 'react';
import {Table , Button} from 'antd';
import columns from './columns';
import './index.less';
import XLSX$Consts from 'xlsx';

class orderMatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[]
    };
  }
  componentDidMount() {
    fetch(window.apiUrl+"/box/getUploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then(r=>{
      this.setState({dataSource:r})
    })
  }
  doit () {
    var elt = document.getElementById('table');
    var wb = XLSX$Consts.utils.table_to_book(elt, {raw: true, sheet:"Sheet JS"});
    XLSX$Consts.writeFile(wb, (new Date()+'已匹配订单.xlsx'));
  }
  render() {
    return (
      <div className="orderMatched">
        <Button className="election"
                onClick={this.doit.bind(this)}
        >导出Excel</Button>
        <Table className="tableList"
               id='table'
               dataSource={this.state.dataSource}
               columns={columns}
               bordered
               rowKey={(record, index) => `id:${record.boxCode}${index}`}
               scroll={{
                 x: 1800,
                 y: 600
               }}
               pagination={false}
        />
      </div>
    )
  }
}

export default orderMatched;