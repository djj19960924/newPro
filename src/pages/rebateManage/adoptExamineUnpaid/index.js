import React from 'react';
import {Button,Table,Icon,message} from 'antd';
import './index.less'

class adoptExamineUnpaid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      remarks:'unShow',
      payment:null,
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
      returningMoney2:null
    };
  }
  componentWillMount() {
    this.unPaid(2);
  }
  unPaid(payment) {
    fetch(window.theUrl + '/programUser/getProgramUserNotPayList',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:'payment='+payment
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.data,payment:payment})
    })
  }
  notSetUp() {
    fetch(window.theUrl + '/programUser/getProgramUserNoPayment',{
      method:"post",
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:'payment='
    }).then(response=>response.json()).then((res)=>{
      this.setState({dataSource:res.data,payment:null})
    })
  }
  makeMoney(payment,returningMoney,unionId) {
    this.setState({payment:payment,remarks:'showRemark',mask:'mask',returningMoney:returningMoney*0.99,unionId:unionId})
    fetch(window.theUrl + '/programUser/getProgramUserByUnionId',{
      method:'post',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:'unionId='+unionId
    }).then(res=>res.json()).then((res)=>{
      if(res.status===10000){
        this.setState({userName: res.data.userName,
          cardNo: res.data.cardNo,
          openingBank: res.data.openingBank,
          wechatNo: res.data.wechatNo,
          alipayName: res.data.alipayName,
          alipayNo: res.data.alipayNo,
          returnedMoney: res.data.returnedMoney,
          returningMoney2:res.data.returningMoney})
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
    fetch(window.theUrl+'/programUser/updatePayAndReciptByUnionId',{
      method:'post',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify(data),
    }).then(res=>res.json()).then((res)=>{
      // console.log(res);
      if(res.status===10000){
        message.info('确认打款成功');
        this.setState({remarks:'unShow',mask:'unShow'});
        this.unPaid(this.state.payment)
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
    }, {
      title: '应付金额',
      dataIndex: 'returningMoney2',
      key: 'returningMoney2',
      render: (text, record) => (  //塞入内容
        <div className={"ellipsis"} >{(record.returningMoney*0.99).toFixed(2)}</div>
      ),
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
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
          <div className={this.state.payment==null ? 'choose':""} onClick={this.notSetUp.bind(this)}>未设置提现方式</div>
        </div>

        <Table  id="table"
                className="tableList"
                columns={columns}
                dataSource={this.state.dataSource}
                bordered
                rowKey={(record, index) => `id:${record.boxCode}${index}`}
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