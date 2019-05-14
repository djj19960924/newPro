import React from 'react';
import {Button,Table,Icon,message, Pagination,} from 'antd';
import './index.less'

class adoptExamineUnpaid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      remarks:'unShow',
      mask:'unShow',
      returningMoney:null,
      unionId:null,
      userName: null,
      cardNo: null,
      openingBank: null,
      wechatNam: null,
      wechatNo: null,
      alipayName: null,
      alipayNo: null,
      returnedMoney: null,
      returningMoney2:null,
      payment: 2,
      pageNum: 1,
      pageSize: 10,
      pageTotal: null,
    };
  }
  componentDidMount() {
    this.getProgramUserNotPayList();
  }
  // 获取列表
  getProgramUserNotPayList(payment=this.state.payment,pageNum=this.state.pageNum,pageSize=this.state.pageSize) {
    fetch(window.fandianUrl + '/programUser/getProgramUserNotPayList',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`payment=${payment}&pageNum=${pageNum}&pageSize=${pageSize}`
    }).then(response=>response.json()).then((res)=>{
      this.setState({
        dataSource: res.data.list,
        pageTotal: res.data.total,
        pageSize: pageSize,
        pageNum: pageNum,
        payment: payment
      })
    })
  }
  // 调用获取列表事件
  unPaid(payment) {
    this.getProgramUserNotPayList(payment,1,10)
  }
  notSetUp(pageNum=this.state.pageNum,pageSize=this.state.pageSize) {
    fetch(window.fandianUrl + '/programUser/getProgramUserNoPayment',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`payment=&pageNum=${pageNum}&pageSize=${pageSize}`
    }).then(response=>response.json()).then((res)=>{
      this.setState({
        dataSource:res.data.list,
        pageTotal: res.data.total,
        pageSize: pageSize,
        pageNum: pageNum,
        payment: null
      })
    })
  }
  // 改变每页尺寸
  changePageSize(pageNum,pageSize) {
    // console.log(pageNum,pageSize)
    if (this.state.payment===null) {
      this.notSetUp(pageNum,pageSize)
    } else {
      this.getProgramUserNotPayList(this.state.payment,pageNum,pageSize)
    }
  }
  // 翻页事件
  changePage(pageNum,pageSize) {
    if (this.state.payment===null) {
      this.notSetUp(pageNum,pageSize)
    } else {
      this.getProgramUserNotPayList(this.state.payment,pageNum,pageSize)
    }
  }
  makeMoney(payment,returningMoney,unionId) {
    this.setState({payment:payment,remarks:'showRemark',mask:'mask',returningMoney:(returningMoney*0.99).toFixed(2),unionId:unionId})
    fetch(window.fandianUrl + '/programUser/getProgramUserByUnionId',{
      method:'post',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:'unionId='+unionId
    }).then(res=>res.json()).then((res)=>{
      if(res.status===10000){
        this.setState({
          userName: res.data.userName,
          cardNo: res.data.cardNo,
          openingBank: res.data.openingBank,
          wechatNo: res.data.wechatNo,
          alipayName: res.data.alipayName,
          alipayNo: res.data.alipayNo,
          returnedMoney: res.data.returnedMoney,
          returningMoney2:(res.data.returningMoney).toFixed(2)
        })
      }
    })
  }
  //确认已经打款
  openNotification() {
    let data={
      returnedMoney: this.state.returnedMoney,
      returningMoney: this.state.returningMoney2,
      unionId: this.state.unionId
    };
    fetch(window.fandianUrl+'/programUser/updatePayAndReciptByUnionId',{
      method:'post',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify(data)
    }).then(res=>res.json()).then((res)=>{
      // console.log(res);
      if(res.status===10000){
        message.info('确认打款成功');
        this.setState({remarks:'unShow',mask:'unShow'});
        this.getProgramUserNotPayList(this.state.payment)
      }
    })
  }
  //关闭确认打款
  closeReject() {
    this.setState({remarks:'unShow',mask:'unShow'})
  }
  render() {
    const columns=[{
      title: '申请人',
      dataIndex: 'wechatName',
      key: 'wechatName',
    }, {
      title: '申请金额',
      dataIndex: 'returningMoney',
      key: 'returningMoney',
      width: 150,
    }, {
      title: '应付金额',
      dataIndex: 'returningMoney2',
      key: 'returningMoney2',
      width: 150,
      render: (text, record) => (  //塞入内容
        <div className={"ellipsis"} >{(record.returningMoney*0.99).toFixed(2)}</div>
      ),
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record) => (  //塞入内容
        <div className={record.payment ? "ellipsis":'unShow'} ><Button type="primary" onClick={this.makeMoney.bind(this,record.payment,record.returningMoney,record.unionId)} style={{'margin':0}}>打款</Button></div>
      ),
    }];
    return (
      <div className="adoptExamineUnpaid">
        <div className='chooseFact'>
          <div className={this.state.payment===2 ? 'choose':""} onClick={this.unPaid.bind(this,2)}>提现到支付宝</div>
          <div className={this.state.payment===1 ? 'choose':""} onClick={this.unPaid.bind(this,1)}>提现到银行卡</div>
          <div className={this.state.payment===3 ? 'choose':""} onClick={this.unPaid.bind(this,3)}>提现到微信</div>
          <div className={this.state.payment==null ? 'choose':""} onClick={this.notSetUp.bind(this,1,10)}>未设置提现方式</div>
        </div>

        <Table  id="table"
                className="tableList"
                columns={columns}
                dataSource={this.state.dataSource}
                bordered
                scroll={{ y: 600 }}
                rowKey={(record, index) => `id:${record.boxCode}${index}`}
                pagination={false}
        />
        <Pagination className="tablePagination"
                    total={this.state.pageTotal}
                    // total={50}
                    pageSize={this.state.pageSize}
                    current={this.state.pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePageSize.bind(this)}
        />
        <div className={this.state.mask} />
        <div className={this.state.remarks }>
          <div className='remark-title'>
            <Icon type='close' onClick={this.closeReject.bind(this)} />
          </div>
          <p className={this.state.payment === 1 ? '':'unShow'}>持卡人 : {this.state.userName}</p>
          <p className={this.state.payment === 1 ? '':'unShow'}>银行卡号 : {this.state.cardNo}</p>
          <p className={this.state.payment === 1 ? '':'unShow'}>开户行 : {this.state.openingBank}</p>
          <p className={this.state.payment === 2 ? '':'unShow'}>名称 : {this.state.alipayName}</p>
          <p className={this.state.payment === 2 ? '':'unShow'}>账号 : {this.state.alipayNo}</p>
          <p className={this.state.payment === 3 ? '':'unShow'}>微信号 : {this.state.wechatNo}</p>
          <p>打款金额 : {this.state.returningMoney}元(人民币)</p>
          <Button type="primary"  onClick={this.openNotification.bind(this)}>确认已经打款</Button>
        </div>
      </div>
    )
  }
}

export default adoptExamineUnpaid;