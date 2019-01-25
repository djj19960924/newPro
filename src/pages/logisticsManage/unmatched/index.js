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
      dataSource:[],
      selectedRowKeys: []
    };
  }
  componentWillMount() {
    this.tableList2();
  }
  tableList2 (){
    fetch(window.apiUrl+"/box/getBoxOrderList2",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.boxOrderList})
    })
  }
  tableList (){
    fetch(window.apiUrl+"/box/getBoxOrderList",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.boxOrderList})
    })
  }
  upload (){

    fetch(window.apiUrl+"/box/uploadBoxOrder",{
      method:"GET",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(response=>response.json()).then((res)=>{
      alert(res.Message);
    })
  }
  uploadChoosed() {
    for(var i=0; i<this.state.selectedRowKeys.length;i++){
      if(Number(this.state.selectedRowKeys[i])!==0){
        this.state.selectedRowKeys[i]=this.state.selectedRowKeys[i].slice(3,-1);
      }else{
        this.state.selectedRowKeys.splice(i,1)
      }
    }
    console.log(this.state.selectedRowKeys);
    let  boxlist={boxCodeList:this.state.selectedRowKeys};
    fetch(window.apiUrl+"/box/getUploadBoxOrderByBoxCode",{
      method:"post",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify(boxlist)
    }).then(response=>response.json()).then((res)=>{
      alert(res.Message);
      this.tableList2();
    })
  }
  doit () {
    var elt = document.getElementById('table');
    var wb = XLSX$Consts.utils.table_to_book(elt, {sheet:"Sheet JS"});
    XLSX$Consts.writeFile(wb, (new Date()+'未匹配订单.xlsx'));
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className="orderUnmatched">
        <p className="topBtn">
          <Button className="election"
                  onClick={this.upload.bind(this)}
          >一键上传etk</Button>
          <Button className="election"
                  onClick={this.uploadChoosed.bind(this)}
          >选中上传etk</Button>
          <Button className="election"
                  onClick={this.doit.bind(this)}
          >导出Excel</Button>
        </p>
        <Table id="table"
               className="tableList"
               dataSource={this.state.dataSource}
               columns={columns}
               rowSelection={rowSelection}
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

export default orderUnmatched;