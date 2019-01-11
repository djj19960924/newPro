import React from 'react';
import {Button, DatePicker, Form, Icon, Input, message, Select, Radio, notification, } from 'antd';
import moment from 'moment';
import ImageViewer from '@components/imageViewer/main';
import {inject, observer} from 'mobx-react/index';
import countryList from '@js/country';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

// 正则小计(中文+韩文+英文+数字+()-_/\):
//
// new RegExp('^[\u4e00-\u9fa5]|[\uac00-\ud7a3]|[a-zA-Z0-9]|[\(\)\-\_\/]+$')
// 中文: [\u4e00-\u9fa5]
// (包括所有中文汉字,日文汉字,韩文汉字, 根据系统文字显示相应汉字字符样式)
// 韩文: [\uac00-\ud7a3]
// 日文: [\u3041-\u30ff]
// 中文括号(即（）): [\uff08\uff09]
// 正整数正则: /^[1-9]\d*$/

@inject('appStore') @observer @Form.create()
class awaitingExamine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 图片查看器开关
      showImageViewer: false,
      // 当前图片地址
      // imgSrc: require('@img/avatar.png'),
      //选择的国家
      country:'',
      //国家列表
      countries: [],
      //选择的商场
      shop:undefined,
      // 商场列表
      shopList: [],
      // 当前所选商场
      currentShop: undefined,
      // 消费金额
      totalMoney: null,
      // 是否有剩余的小票
      hasTicket: false,
      // 剩余小票列表
      ticketList: [],
      // 小票总数
      ticketTotal: 0,
      // 已完成小票数
      ticketDone: null,
      // 当前小票
      currentTicket: 0,
      // 品牌列表
      brandList: [],
      // 当前时间
      ticketDate: moment(new Date()).format('YYYY-MM-DD'),
      // 当前团号
      teamNo: '',
      // 当前所选择小票
      currentTicketId: 0,
      // 当前品牌名
      currentBrandName: '',
      // 返点金额
      reciptMoney: 0,
      // 驳回备注框的样式
      remarks: 'unShow ',
      // 驳回备注原因
      reason: null,
      // 图片预览宽高自适应
      previewImageWH: 'width',
      // 汇率
      defaultExchangeRate: null,
    };
    window.awaitingExamine = this;
  }

  componentWillMount() {
    let countries = [];
    for (let i of countryList) {
      countries.push(<Option key={i.id} value={i.nationName}>{i.nationName}</Option>)
    }
    this.setState({
      countries: countries
    });
    fetch(window.fandianUrl + '/recipt/getExchangeRateByDate', {
      method: 'POST'
    }).then(r => r.json()).then(r => {
      // console.log(r.result.rate)
      if (r.success === '1') {
        this.setState({
          defaultExchangeRate: parseFloat(r.result.rate).toFixed(4)
        })
      }
    })
  }

  //渲染完成以后修正图片预览样式
  componentDidUpdate() {
    // 这里使用onload属性, 等待图片资源加载完成以后执行
    document.getElementsByClassName('previewImage')[0].onload = function () {
      let pI = document.getElementsByClassName('previewImage')[0];
      if ((pI.width / pI.height) < (2/3)) {
        window.awaitingExamine.setState({
          previewImageWH: 'height'
        })
      } else if ((pI.width / pI.height) >= (2/3)) {
        window.awaitingExamine.setState({
          previewImageWH: 'width'
        })
      }
    };
  }
// 监听选择国家事件
  selectCountry(val, option) {
    this.setState({country:val,  pageTotal: null,mallName:'', ticketList:[],
      hasTicket: false,
      currentShop: undefined,
      currentTicketId: 0,
      ticketTotal: 0});
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body:'nationName='+val
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        // message.success(r.retcode.msg)
        let dataList = [];
        for (let i of r.data) {
          dataList.push(<Option key={i.mallId} value={i.mallName}>{i.mallName}</Option>)
        }
        this.setState({
          shopList: dataList
        })
        // 成功静默处理
        // message.success(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      } else {
        message.error(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      }
    });
  }
  // 监听选择商店事件
  selectShop(val, option) {
    // val即商场名, option.key即商场ID
    // console.log(val, option.key)
    fetch(window.fandianUrl + '/brand/getBrandList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val,
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        let dataList = [];
        for (let i of r.data) {
          // console.log(i)
          // 这里的value会作为选择框的搜索字段, 所以需求同时可以根据Id或者Name查询, 则在value值中同时插入Id和Name
          // 但是注意最终传值时不要取value
          dataList.push(<Option key={i.brandId} name={i.brandName}
                                value={i.brandId + i.brandName}>{i.brandName}</Option>)
        }
        this.setState({
          brandList: dataList,
        })
      }
    });
    this.getTicketList(this,val);
  }
  // 根据商场名称获取小票接口
  getTicketList(f, val = this.state.currentShop) {
    fetch(window.fandianUrl + '/recipt/getReciptByMallName', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val + '&pageNum=1&pageSize=20',
    }).then(r => r.json()).then(r => {
      //console.log(r);
      if (r.retcode.status === '10000') {
        f.setState({
          ticketList: r.data.pageInfo.list,
          hasTicket: !!r.data.pageInfo.total,
          currentShop: val,
          currentTicketId: 0,
          ticketTotal: r.data.pageInfo.total,
          remarks:'unShow',
          reason:null
        });
      }
      // 首次选择表单给予默认值
      if (!!r.data.pageInfo.total) {
        this.props.form.setFieldsValue({
          teamNo: r.data.pageInfo.list[0].teamNo,
          consumeMoney: r.data.pageInfo.list[0].consumeMoney,
          reciptAttribute: r.data.pageInfo.list[0].reciptAttribute,
          exchangeRate: r.data.pageInfo.list[0].exchangeRate,
          rebateRate: r.data.pageInfo.list[0].rebateRate,
        })
      }
    });
  }

  // 改变当前品牌
  changeCurrentBrand(val, opt) {
    this.setState({
      currentBrandName: opt.props.name
    });
    this.getRebateRate(val, opt.props.name);
  }

  // 获取当日返点率
  getRebateRate(val, name, date = this.state.ticketDate) {
    let data = {
      mallName: this.state.currentShop,
      brandName: name,
      rebateDate: date
    };
    fetch(window.fandianUrl + '/rebate/getRebateByDate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(r => r.json()).then(r => {
      // console.log('获取当日返点率')
      this.props.form.setFieldsValue({
        rebateRate: r.data ? r.data.rebateRate : 0
      });
      this.changeReciptMoney()
    })
  }

  // 日期改变
  changeTicketDate(date) {
    this.setState({
      ticketDate: moment(date).format('YYYY-MM-DD')
    })
    if (!!this.state.currentBrandName) {
      this.getRebateRate(this.props.form.getFieldValue('currentBrand'), this.state.currentBrandName, moment(date).format('YYYY-MM-DD'))
    }
  }

  // 修改返点率触发
  changeRebateRate() {
    this.changeReciptMoney()
  }

  // 修正返点金额
  changeReciptMoney() {
    let totalMoney = parseFloat(document.querySelector('#totalMoney').value);
    let rebateRate = parseInt(document.querySelector('#rebateRate').value);
    let exchangeRate = parseFloat(document.querySelector('#exchangeRate').value);
    this.setState({
      reciptMoney: (!!totalMoney && !!rebateRate && !!exchangeRate) ? parseFloat((totalMoney * rebateRate / 100 * exchangeRate).toFixed(2)) : '0'
    })
  }

  // 修正汇率触发
  changeExchangeRate() {
    this.changeReciptMoney()
  }

  // 打开图片查看器
  openImageViewer() {
    this.setState({
      showImageViewer: true,
    })
  };

  // 关闭图片查看器
  closeImageViewer() {
    this.setState({
      showImageViewer: false,
    })
  }

  // 自定义表单验证返点率, 同时修正正确的显示值
  rebateRateValidator(rule, val, callback) {
    let rebateRate = parseFloat(document.querySelector('#rebateRate').value);
    let thisRule = /^\d+(\.\d{0,1})?$/;
    if (thisRule.test(val)) {
      if (parseFloat(val) >= 0 && parseFloat(val) <= 99.9) {
        callback();
        this.props.form.setFieldsValue({rebateRate: parseFloat(val)});
        document.querySelector('#rebateRate').value = rebateRate;
      } else {
        callback('返点率范围在0到100以内')
      }
    } else if (val === '') {
      this.props.form.setFieldsValue({rebateRate: 0});
      document.querySelector('#rebateRate').value = 0;
    } else {
      callback('返点率最多可输入小数点后一位')
    }
  }

  // 自定义表单验证汇率, 同时修正正确的显示值
  exchangeRateValidator(rule, val, callback) {
    let exchangeRate = parseFloat(document.querySelector('#exchangeRate').value);
    let thisRule = /^\d+(\.\d{0,4})?$/;
    if (thisRule.test(val)) {
      if (parseFloat(val) < 999) {
        this.props.form.setFieldsValue({exchangeRate: parseFloat(val)});
        document.querySelector('#exchangeRate').value = exchangeRate;
        callback()
      } else {
        callback('汇率最大不可超过3位数')
      }
    } else if (val === '') {
      this.props.form.setFieldsValue({exchangeRate: 0});
      document.querySelector('#exchangeRate').value = 0;
    } else {
      callback('汇率最多可输入小数点后四位')
    }
  }

  // 消费金额验证格式, 在输入时强制修正输入的值
  setTotalMoney(event) {
    let val = event.target.value;
    // let val = this.props.form.getFieldValue('totalMoney');
    // 正则, 输入为数字, 最多可至小数点后两位
    let rule = /^\d+(\.\d{0,2})?$/;
    if (rule.test(val)) {
      // 当字符串通过正则时
      if (parseFloat(val) < 999999) {
        // 数字小于6位时, 将数字转为float以后再转回字符串, 去掉头部的0
        let valStr = parseFloat(val).toString();
        event.target.value = valStr;
        this.props.form.setFieldsValue({
          totalMoney: valStr,
        })
      } else {
        // 数字过大时, 将表单内存储的正常值赋回input中
        event.target.value = this.props.form.getFieldValue('totalMoney')
      }
    } else if (val === '') {
      // 删除所有值时
      this.props.form.setFieldsValue({
        totalMoney: '',
      });
      event.target.value = '';
    } else {
      event.target.value = this.props.form.getFieldValue('totalMoney')
    }
    this.changeReciptMoney()
  }

  // 日期选择器范围
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }

  // 通过 - 提交表单
  handleSubmit() {
    //.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((err, val) => {
      console.log(!err);
      console.log(val);
      let the = this.state;
      if (!err) {
        let data = {
          reciptId: the.ticketList[the.currentTicketId].reciptId,
          mallName: the.currentShop,
          teamNo: val.teamNo,
          consumeMoney: val.totalMoney,
          reciptAttribute: val.reciptAttribute,
          brandName: the.currentBrandName,
          consumeDate: moment(val.ticketDate).format('YYYY-MM-DD'),
          exchangeRate: val.exchangeRate,
          rebateRate: val.rebateRate,
          reciptMoney: the.reciptMoney,
          unionId: the.ticketList[the.currentTicketId].unionId,
        };
        fetch(window.fandianUrl + '/recipt/checkReciptAllow', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        }).then(r => r.json()).then(r => {
          this.hasSubmit();
        })
      }
    });
  }
  // 提交结束以后切换小票逻辑
  hasSubmit() {
    let the = this.state;
    // 重置表单
    this.props.form.resetFields();
    the.ticketTotal = the.ticketTotal - 1;
    if (the.currentTicketId === (the.ticketList.length - 1)) {
      this.getTicketList(this);
    } else if (the.currentTicketId <= (the.ticketList.length - 1)) {
      this.setState({
        currentTicketId: the.currentTicketId + 1,
        // 清空驳回列表
        remarks:'unShow',
        reason:null
      })
    }
  }

  // 驳回申请
  rejected() {
    this.setState({remarks:'showRemark'})
  }
  // 关闭驳回
  closeReject() {
    this.setState({remarks:'unShow'})
  }
  // 选择驳回原因
  onRadioChange(e) {
    this.setState({
      reason: e.target.value,
    });
  }
  //驳回备注确定
  openNotification() {
    if(this.state.reason!==null){
      let reject={
        reciptId:this.state.ticketList[this.state.currentTicketId].reciptId,
        note:this.state.reason
      }
      fetch(window.fandianUrl+'/recipt/checkReciptRejected',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reject),
      }).then(res=>res.json()).then(res=>{
        this.hasSubmit()
      })
    }else if(this.state.reason===null) {
      notification['warning']({
        message: '请选择驳回原因'
      });
    }
  }
  render() {
    let {showImageViewer, shopList, currentShop, hasTicket, brandList, ticketList, currentTicketId, reciptMoney, defaultExchangeRate, previewImageWH, ticketTotal, country} = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="awaitingExamine">
        <div className="shopSelect">
          <span>所属国家: </span>
          <Select className="selectShops"
                  placeholder="请选择国家"
                  onChange={this.selectCountry.bind(this)}
          >
            {this.state.countries}
          </Select>
        </div>
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  value={currentShop}
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
          <span style={{marginLeft: 20}}>当前商场剩余小票：{!!ticketTotal ? ticketTotal : '暂无小票'}</span>
        </div>
        <div className="noTicket" style={{display: (hasTicket ? 'none' : 'block')}}>
          {currentShop && <div><Icon type="smile" className="iconSmile"/><span>当前商场没有小票</span></div>}
          {!country && <div><Icon type="shop" className="iconShop"/><span>请选择国家</span></div>}
          {country &&!currentShop && <div><Icon type="shop" className="iconShop"/><span>请选择商场</span></div>}
        </div>
        <div className="container" style={{display: (hasTicket ? 'block' : 'none')}}>
          <div className="containerBody containerImage">
            {/*单图片功能*/}
            <img className="previewImage"
                 src={!!ticketList.length ? ticketList[currentTicketId].pictureUrl : ''}
                 alt=""
                 onClick={this.openImageViewer.bind(this)}
                 style={{
                   width: previewImageWH === 'width' ? '100%' : 'auto',
                   height: previewImageWH === 'height' ? '100%' : 'auto',
                 }}
            />
          </div>
          <div className="containerBody containerForm">
            <Form className="examineForm"
                  id='myForm'
                  onSubmit={this.handleSubmit.bind(this)}
            >
              <FormItem label="商场"
                        colon
                        labelCol={{span: 3}}
              >
                <Input style={{width: 150, marginLeft: 10, marginRight: 20, color: '#555'}}
                       disabled
                       value={currentShop}
                />
                {/*<span>团号：</span>*/}
                {/*{getFieldDecorator('teamNo', {*/}
                  {/*initialValue: (currentTicketId >= ticketList.length || ticketList.length === 0) ? '' : ticketList[currentTicketId].teamNo*/}
                {/*})(*/}
                  {/*<Input style={{width: 80, marginLeft: 10, color: '#555'}}*/}
                         {/*disabled*/}
                  {/*/>*/}
                {/*)}*/}
              </FormItem>
              <FormItem label="消费金额 ($)"
                        colon
                        labelCol={{span: 6}}
                        wrapperCol={{span: 8}}
              >
                {getFieldDecorator('totalMoney', {
                  rules: [{required: true, message: '请输入消费金额!'}],
                  // initialValue: '0'
                })(
                  <Input style={{width: 130,}}
                         type="number"
                    // value={totalMoney}
                         placeholder="请输入消费金额"
                         onChange={this.setTotalMoney.bind(this)}
                         id="totalMoney"
                  />
                )}
              </FormItem>
              <FormItem label="属性"
                        colon
                        labelCol={{span: 3}}
              >
                {getFieldDecorator('reciptAttribute', {
                  rules: [{required: true}],
                  initialValue: 'SG'
                })(
                  <Select style={{width: 90}}
                    // defaultValue="SG"
                  >
                    <Option key="SG">SG</Option>
                    <Option key="MG">MG</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="品牌"
                        colon
                        labelCol={{span: 3}}
                        wrapperCol={{span: 10}}
              >
                {getFieldDecorator('currentBrand', {
                  rules: [{required: true, message: '请输入品牌!'}],
                })(
                  <Select style={{width: 240}}
                          placeholder="请输入编码/品牌查询"
                          showSearch
                          onChange={this.changeCurrentBrand.bind(this)}
                  >
                    {brandList}
                  </Select>
                )}
              </FormItem>
              <FormItem label="选择日期"
                        colon
                        labelCol={{span: 5}}
                        wrapperCol={{span: 5}}
              >
                {getFieldDecorator('ticketDate', {
                  rules: [{required: true}],
                  initialValue: moment(new Date())
                })(
                  <DatePicker style={{width: 120}}
                              allowClear={false}
                              disabledDate={this.disabledDate}
                              onChange={this.changeTicketDate.bind(this)}
                    // defaultValue={moment(new Date())}
                    // value={ticketDate}
                  />
                )}
              </FormItem>
              <FormItem label="汇率"
                        colon
                        labelCol={{span: 3}}
                        wrapperCol={{span: 20}}
              >
                {getFieldDecorator('exchangeRate', {
                  rules: [
                    {required: true,},
                    {validator: this.exchangeRateValidator.bind(this)}
                  ],
                  initialValue: defaultExchangeRate ? defaultExchangeRate : 0
                })(
                  <Input style={{width: 90}}
                         type="number"
                         id="exchangeRate"
                         onChange={this.changeExchangeRate.bind(this)}
                  />
                )}
              </FormItem>
              <FormItem label="返点率"
                        colon
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20}}
                // validator={this.rebateRateValidator}
              >
                {getFieldDecorator('rebateRate', {
                  rules: [
                    {required: true, message: '请输入返点率!'},
                    {validator: this.rebateRateValidator.bind(this)}
                  ],
                  initialValue: 0
                })(
                  <Input style={{width: 60}}
                         type="number"
                         id="rebateRate"
                         onChange={this.changeRebateRate.bind(this)}
                  />
                )}
                <span> %</span>
                <span style={{marginLeft: 20}}>返点金额(¥)：{reciptMoney}</span>
              </FormItem>
              <FormItem>
                <Button type="primary"
                        htmlType="submit"
                        className="examineFormButton"
                        style={{marginTop: '15px',marginLeft: '10px'}}
                        // onClick={this.handleSubmit.bind(this)}
                >
                  通过
                </Button>
                <Button type="danger"
                        onClick={this.rejected.bind(this)}
                        style={{marginLeft: '20px'}}
                >
                  驳回
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div className={this.state.remarks + ' popup'}>
          <div className='remark-title'>
            <Icon type='close' onClick={this.closeReject.bind(this)}></Icon>
            <span>请选择驳回原因</span>
          </div>
          <RadioGroup className='allReasons' onChange={this.onRadioChange.bind(this)} value={this.state.reason}>
            <Radio value={0}>小票不清晰</Radio>
            {/*<Radio value={1}>团号不正确</Radio>*/}
            <Radio value={2}>小票重复</Radio>
            <Radio value={3}>其他</Radio>
          </RadioGroup>
          <Button type="primary"  onClick={this.openNotification.bind(this)}>确定</Button>
        </div>

        {showImageViewer &&
        <ImageViewer // 图片链接, 上为图片查看器开关
          imgSrc={!!ticketList.length ? ticketList[currentTicketId].pictureUrl : ''}
          // 关闭图片查看
          closeImageViewer={() => this.closeImageViewer()}
          option={{
            // 添加图片拖拽功能
            move: true,
            // 添加图片旋转功能
            rotate: true,
            // 添加鼠标滚轮放大缩小功能
            zoom: true,
            // 添加遮罩层, 点击遮罩层可以关闭图片预览
            shadow: false,
          }}
        />}
      </div>
    );
  }
}

export default awaitingExamine;