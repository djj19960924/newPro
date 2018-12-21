import React from 'react';
import {Table , Button} from 'antd';
// import '@js/xlsx.full.min.js';
import XLSX$Consts from 'xlsx';
import columns from './columns';
import './index.less';

class orderUnmatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[]
    };
  }
  componentWillMount() {
    fetch("http://api.maishoumiji.com/box/getBoxOrderList",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.boxOrderList})
    })
  }
  upload (){
    fetch("http://api.maishoumiji.com/box/uploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(response=>response.json()).then((res)=>{
      alert(res.Message);
    })
  }
  doit () {
    var elt = document.getElementById('table');
    var wb = XLSX$Consts.utils.table_to_book(elt, {sheet:"Sheet JS"});
    XLSX$Consts.writeFile(wb, (new Date()+'未匹配订单.xlsx'));
  }
  render() {
    return (
      <div className="orderUnmatched">
        <p className="topBtn">
          <Button className="election"
                  onClick={this.upload}
          >一键上传etk</Button>
          <Button className="election"
                  onClick={this.doit.bind(this)}
          >导出Excel</Button>
        </p>
        <Table id="table"
               className="tableList"
               dataSource={this.state.dataSource}
               columns={columns}
               bordered
               rowKey={(record, index) => `id:${record.boxCode}${index}`}
               scroll={{
                 x: 1800,
                 y: 600
               }}
        />
      </div>
    )
  }
}

export default orderUnmatched;