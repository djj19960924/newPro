import React from 'react';
import './index.less';
import {Radio, Button, Table, message,Pagination} from 'antd';

class yuant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //表格数据
      data: [],
      //待发货 0  已发货 1
      status: 0,
      // 选中条目ID
      selectedIds: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 100,
      pageTotal:0
    }
  }

  componentDidMount() {
    this.setState({tableLoading:true})
    this.getOrderInfo(0);
  }

  getOrderInfo(status=this.state.status,pageNum=this.state.pageNum,pageSize=this.state.pageSize) {
    fetch(window.testUrl + "/Yto/backendIsYto", {
      method: "post",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: "isYto=" + status+"&pageNum="+pageNum+"&pageSize="+pageSize
    }).then(r => r.json()).then((res) => {
      this.setState({tableLoading:false})
      if (res.status === 10000) {
        message.success(`${res.status}:${res.msg}`)
        this.setState({data: res.data.list, selectedList: [], selectedIds: [],pageTotal:res.data.total, pageSizeOptions: [`100`,`200`,`500`,`${res.data.total > 1000 ? res.data.total : 1000}`]})
      } else {
        if(res.status===10002){
          message.warning(`${res.status}:${res.msg}`)
          this.setState({data:[]});
        }else{
          message.error(`${res.status}:${res.msg}`)
          this.setState({data:[]});
        }
      }
    })
  }

  logisticsStatus(e) {
    console.log(e.target.value)
    if (this.state.status !== e.target.value) {
      this.setState({status: e.target.value,tableLoading:true})
      this.getOrderInfo(e.target.value)
    }
  }

  // 更改当前页或每页显示条数
  changePage(n,s) {
    this.setState({
      pageNum: n,
      pageSize: s,
      tableIsLoading:true
    },function(){
      this.getOrderInfo();
    })

  }
//上传
  uploadOrder (){
    let selectNo=[];
    for(let i=0;i<this.state.selectedIds.length;i++){
      selectNo[i]=this.state.selectedIds[i].split(":")[1];
    }
    fetch(window.testUrl+"/Yto/uploadSelectToYto",{
      method:"post",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(selectNo)
    }).then(r=>r.json()).then((res)=>{
      if(res.status===10000){
        this.getOrderInfo(0);
        message.success(`${res.status}:${res.msg}`)
      }else{
        message.success(`${res.status}:${res.msg}`)
      }
    })
  }
  render() {
    var columns = [
      {title: "箱号", dataIndex: "parcelNo", key: "parcelNo",width:50},
      {title: "商品名称", dataIndex: "productName", key: "productName",width:100},
      {title: "收件人姓名", dataIndex: "recipientsName", key: "recipientsName",width:100},
      {title: "收件人手机", dataIndex: "recipientsPhone", key: "recipientsPhone",width:140},
      {title: "收件人省份", dataIndex: "recipientsProvince", key: "recipientsProvince",width:100},
      {title: "收件人城市", dataIndex: "recipientsCity", key: "recipientsCity",width:100},
      {title: "收件人区", dataIndex: "recipientsDistrict", key: "recipientsDistrict",width:100},
      {title: "收件人详细地址", dataIndex: "recipientsAddress", key: "recipientsAddress",width:160},
      {title: "用户微信昵称", dataIndex: "wechatName", key: "wechatName",width:100},
      {title: "该包裹下商品件数", dataIndex: "productNum", key: "productNum",width:160},
      {title: "包裹创建时间", dataIndex: "updateTime", key: "updateTime"}
    ];
    var columns1 = [
      {title: "绑定的面单号", dataIndex: "mailNo", key: "mailNo",width:130}
    ];
    columns1.push(...columns);
    const RadioButton = Radio.Button, RadioGroup = Radio.Group;
    return (
      <div className="yuanTong">
        <RadioGroup buttonStyle="solid"
                    className="radioBtn"
                    value={this.state.status}
                    onChange={this.logisticsStatus.bind(this)}
        >
          <RadioButton value={0}>待发货</RadioButton>
          <RadioButton value={1}>已发货</RadioButton>
        </RadioGroup>
        <Button type="primary" disabled={this.state.selectedIds.length === 0} onClick={this.uploadOrder.bind(this)}>发送所选订单</Button>
        <Table className="tableList"
          columns={this.state.status === 0 ? columns : columns1}
               dataSource={this.state.data}
               rowSelection={this.state.status === 0 ? {
                 selectedRowKeys: this.state.selectedIds,
                 // 选择框变化时触发c
                 onChange: (selectedRowKeys, selectedRows) => {
                   this.setState({selectedIds: selectedRowKeys});
                   console.log(selectedRowKeys)
                 },
               } : null}
               bordered
               loading={this.state.tableLoading}
               pagination={false}
               scroll={{ y: 500 }}
               rowKey={(record, index) => `id:${record.parcelNo}`}/>
        <Pagination className="tablePagination"
                    total={this.state.pageTotal}
                    pageSize={this.state.pageSize}
                    current={this.state.pageNum}
                    showTotal={(total, range) =>
                      `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`
                    }
                    style={{float:'right',marginRight:20,marginTop:10,marginBottom: 20}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={this.state.pageSizeOptions}
                    onShowSizeChange={this.changePage.bind(this)}
        />
      </div>
    )
  }
}

export default yuant;