import React from 'react';
import {Button, DatePicker, Form, Icon, Input, message, Select, Radio, notification, Badge, } from 'antd';
import moment from 'moment';
import ImageViewer from '@components/imageViewer/main';
import {inject, observer} from 'mobx-react/index';
import countryList from '@js/country';
import MoneyCalculation from './moneyCalculation/index';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

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
      // 选择的国家
      country: '',
      // 国家剩余小票
      countryLeftTicket: {},
      // 选择的商场
      shop: undefined,
      // 商场列表
      shopList: [],
      // 当前所选商场
      currentShop: undefined,
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
      brandListOrigin: [],
      currentBrandList: [],
      // 子组件上传数据
      totalData: [],
      totalMoney: 0,
      totalClear: false,
      // 当前时间
      ticketDate: moment(new Date()).format('YYYY-MM-DD'),
      // 当前所选择小票
      currentTicketId: 0,
      // 返点金额
      reciptMoney: 0,
      // 驳回备注框的样式
      remarks: 'unShow',
      // 驳回备注原因
      reason: null,
      // 图片预览宽高自适应
      previewImageWH: 'width',
      // 默认汇率, 当以某一汇率提交成功小票以后
      // 会固定汇率选择框, 直到替换国家
      defaultExchangeRate: 1,
      // 自增变数, 用于获取页面刷新
      hasChange: 0,
      // 重复选择框
      repeatList: [],
      // 为空金额
      emptyList: []
    };
    // window.awaitingExamine = this;
  }

  componentDidMount() {
    this.getCountryLeftTicket()
  }

  //渲染完成以后修正图片预览样式
  componentDidUpdate() {
    // 这里使用onload属性, 等待图片资源加载完成以后执行
    document.getElementsByClassName('previewImage')[0].onload = () => {
      let pI = document.getElementsByClassName('previewImage')[0];
      if ((pI.width / pI.height) < (400 / 650)) {
        this.setState({
          previewImageWH: 'height'
        })
      } else if ((pI.width / pI.height) >= (400 / 650)) {
        this.setState({
          previewImageWH: 'width'
        })
      }
    };
  }

  // 获取国家当前剩余小票
  getCountryLeftTicket() {
    fetch(`${window.fandianUrl}/recipt/countReciptByNationName`,{
      method: 'POST',
    }).then(r => r.json()).then(r => {
      if (r.status === 10000) {
        let dataObj = {};
        for (let i in r.data) {
          dataObj[r.data[i].nationName]= r.data[i].reciptTotal
        }
        this.setState({
          countryLeftTicket: dataObj
        });
      } else {
        if (r.status) {
          message.error(`${r.msg}, 状态码为:${r.status}`)
        } else {
          message.error(`后端数据错误`)
        }
      }
    }).catch(r => {
      message.error(`根据国家调取国家剩余小票数量接口失败`)
    })
  }

  // 监听选择国家事件
  selectCountry(e, option) {
    this.setState({
      country: e.target.value,
      pageTotal: null,
      mallName: '',
      ticketList: [],
      hasTicket: false,
      currentShop: undefined,
      currentTicketId: 0,
      ticketTotal: 0,
      defaultExchangeRate: 1,
    });
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'nationName=' + e.target.value
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
        if (r.retcode) {
          message.error(`${r.retcode.msg}, 状态码为:${r.retcode.status}`)
        } else {
          message.error(`后端数据错误`)
        }
      }
    }).catch(r => {
      message.error(`获取商场列表接口调取失败`)
    });
  }

  // 监听选择商店事件
  selectShop(val, option) {
    // val即商场名, option.key即商场ID
    fetch(window.fandianUrl + '/brand/getBrandList', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val,
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        this.setState({
          brandListOrigin: r.data,
          currentShop: val,
        });
      } else {
        if (r.retcode) {
          message.error(`${r.retcode.msg}, 状态码为:${r.retcode.status}`)
        } else {
          message.error(`后端数据错误`)
        }
      }
    }).catch(r => {
      message.error(`获取品牌列表接口调取失败`)
    });
    this.getTicketList(this, val);
  }

  // 根据商场名称获取小票接口
  getTicketList(f, val = this.state.currentShop) {
    fetch(window.fandianUrl + '/recipt/getReciptByMallName', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val + '&pageNum=1&pageSize=20',
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        // 初始化数据
        f.setState({
          ticketList: r.data.pageInfo.list,
          hasTicket: !!r.data.pageInfo.total,
          currentTicketId: 0,
          ticketTotal: r.data.pageInfo.total,
          remarks: 'unShow',
          reason: null
        });
      } else {
        if (r.retcode) {
          message.error(`${r.retcode.msg}, 状态码为:${r.retcode.status}`)
        } else {
          message.error(`后端数据错误`)
        }
      }
    }).catch(r => {
      message.error(`根据商场获取小票接口调取失败`)
    });
  }

  // 日期改变
  changeTicketDate(date) {
    this.setState({
      ticketDate: moment(date).format('YYYY-MM-DD')
    });
  }

  // 修正返点金额
  changeReciptMoney(data = this.state.totalData, isAdd = false) {
    let totalMoney = 0, totalReciptMoney = 0, currentBrandList = [], totalClear = true;
    for (let n in data) {
      totalMoney += ( !!data[n].totalMoney ? data[n].totalMoney : 0 );
      totalReciptMoney += ( (!!data[n].totalMoney && !!data[n].brandRebate) ?
        (data[n].totalMoney / 100 * data[n].brandRebate) : 0 );
      currentBrandList.push(data[n].brand);
      if (!data[n].totalMoney && data[n].totalMoney !== 0) totalClear = false;
    }

    let exchangeRate = parseFloat(document.querySelector('#exchangeRate').value);
    // console.log(`返点金额为: ${ (!!totalReciptMoney && !!exchangeRate) ?
    //   parseFloat((totalReciptMoney * exchangeRate).toFixed(2)) : '0' }\n总金额为: ${totalMoney}`);
    this.setState({
      reciptMoney: ( (!!totalReciptMoney && !!exchangeRate) ?
        parseFloat((totalReciptMoney * exchangeRate).toFixed(2))
        : '0' ),
      totalMoney: totalMoney,
      totalData: data,
      currentBrandList: currentBrandList,
      totalClear: totalClear,
    })
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

  // 日期选择器范围
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }

  // 通过 - 提交表单
  handleSubmit() {
    const { country, totalClear, totalData, } = this.state;
    //.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((err, val) => {
      let the = this.state;
      if (!err) {
        // 这里赋值, 同时判断品牌是否重复
        let dataList = [], repeatList = [];
        for (let n in totalData) {
          let ic = String(dataList.indexOf(totalData[n].brand));
          if (ic !== '-1') {
            if (repeatList.indexOf(ic) === -1) repeatList.push(ic);
            repeatList.push(n);
          }
          dataList.push(the.totalData[n].brand)
        }
        let data = {
          reciptId: the.ticketList[the.currentTicketId].reciptId,
          mallName: the.currentShop,
          teamNo: val.teamNo,
          consumeMoney: the.totalMoney,
          // 这里直接保存数组作为json字符串保存
          brandName: ( the.totalData.length === 0 ? dataList[0] : JSON.stringify(dataList) ),
          consumeDate: moment(val.ticketDate).format('YYYY-MM-DD'),
          exchangeRate: val.exchangeRate,
          // 数据库未保存, 扩展字段
          // rebateRate: val.rebateRate,
          reciptMoney: the.reciptMoney,
          unionId: the.ticketList[the.currentTicketId].unionId,
        };
        if (country === '韩国') data.reciptAttribute= val.reciptAttribute;
        if( val.exchangeRate===0){
          message.error('汇率不能为零')
        } else if (!totalClear || the.totalMoney === null) {
          message.error('消费金额不能为空');
          let dataList = [];
          for (let m in totalData) {
            if (!totalData[m].totalMoney) {
              dataList.push(m)
            }
          }
          this.setState({emptyList:dataList})
        } else if (repeatList.length !== 0) {
          message.error('品牌重复');
          this.setState({repeatList: repeatList});
        } else {
          fetch(window.fandianUrl + '/recipt/checkReciptAllow', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
          }).then(r => r.json()).then(r => {
            if(r.retcode.status==='10000'){
              message.success(`执行通过审核成功`);
              this.setState({defaultExchangeRate: val.exchangeRate,});
              this.hasSubmit();
            } else {
              if (r.retcode) {
                message.error(`${r.retcode.msg}, 状态码为:${r.retcode.status}`)
              } else {
                message.error(`后端数据错误`)
              }
            }
          }).catch(r => {
            message.error(`通过审核接口调取失败`)
          })
        }
      }
    });
  }

  // 提交结束以后切换小票逻辑
  hasSubmit() {
    let the = this.state;
    // 由于不可能每次操作都调取接口, 所以在实际调取审核/驳回接口成功的同时
    // 可以对本地数据进行同步改变, 使得角标以及商场剩余小票数量一直处于与服务器内部数据
    // 数值同步的状态, 虽然没有实时交互, 但也从本地计算的方式达到了类似的效果
    let dataObj = the.countryLeftTicket;
    dataObj[the.country] = dataObj[the.country]-1;
    let d = document.querySelector(`.brandLine.line_0`).querySelector('.noHandlerWrap');
    d.style.border = '';
    this.setState({
      ticketTotal: (the.ticketTotal - 1),
      countryLeftTicket: dataObj,
      hasChange: (the.hasChange + 1),
      reciptMoney: 0,
      consumeMoney: 0,
      totalMoney: null,
      emptyList: [],
      repeatList: [],
    });
    // 重置表单
    this.props.form.resetFields();
    // the.ticketTotal = the.ticketTotal - 1;
    if (the.currentTicketId === (the.ticketList.length - 1)) {
      this.getTicketList(this);
      this.getCountryLeftTicket();
    } else if (the.currentTicketId <= (the.ticketList.length - 1)) {
      this.setState({
        currentTicketId: the.currentTicketId + 1,
        // 清空驳回列表
        remarks: 'unShow',
        reason: null
      });
    }
    // 将汇率修正为成功提交的数值
    this.props.form.setFieldsValue({
      exchangeRate: the.defaultExchangeRate
    });
  }

  //驳回备注确定
  openNotification() {
    if (this.state.reason !== null) {
      let reject = {
        reciptId: this.state.ticketList[this.state.currentTicketId].reciptId,
        note: this.state.reason
      };
      fetch(window.fandianUrl + '/recipt/checkReciptRejected', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reject),
      }).then(res => res.json()).then(r => {
        if (r.retcode.status === `10000`) {
          message.success(`执行驳回成功`);
          this.hasSubmit()
        } else {
          if (r.retcode) {
            message.error(`${r.retcode.msg}, 状态码为:${r.retcode.status}`)
          } else {
            message.error(`后端数据错误`)
          }
        }
      }).catch(r => {
        message.error(`驳回小票接口调取失败`)
      })
    } else if (this.state.reason === null) {
      notification['warning']({
        message: '请选择驳回原因'
      });
    }
  }

  render() {
    let {showImageViewer, shopList, currentShop, hasTicket, brandListOrigin, ticketList, currentTicketId, reciptMoney, defaultExchangeRate, previewImageWH, ticketTotal, country, ticketDate, hasChange, repeatList, emptyList, } = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="awaitingExamine">
        {/*国家选择*/}
        <div className="shopSelect">
          <span style={{marginRight: 5}}>所属国家: </span>
          <RadioGroup defaultValue={0}
                      buttonStyle="solid"
                      className="radioBtn"
                      onChange={this.selectCountry.bind(this)}
          >
            {/*当使用map遍历生成的 react dom 对象时, 才可将对象内部参数为动态值*/}
            {countryList.map((item,i) => (
              <Badge key={i}
                     count={this.state.countryLeftTicket[item.nationName]}
                     overflowCount={99}
              >
                <RadioButton value={item.nationName}>
                  {item.nationName}
                </RadioButton>
              </Badge>
            ))}
          </RadioGroup>
        </div>
        {/*商场选择*/}
        <div className="shopSelect">
          <span style={{marginRight: 5}}>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  value={currentShop}
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
          <span style={{marginLeft: 20}}>当前商场剩余小票：{!!ticketTotal ? ticketTotal : '暂无小票'}</span>
        </div>
        {/*状态提示*/}
        <div className="noTicket" style={{display: (hasTicket ? 'none' : 'block')}}>
          {currentShop && <div><Icon type="smile" className="iconSmile"/><span>当前商场没有小票</span></div>}
          {!country && <div><Icon type="shop" className="iconShop"/><span>请选择国家</span></div>}
          {country && !currentShop && <div><Icon type="shop" className="iconShop"/><span>请选择商场</span></div>}
        </div>

        <div className="container" style={{display: (hasTicket ? 'block' : 'none')}}>
          {/*图片相关功能*/}
          <div className="containerBody containerImage">
            {/*单图片功能*/}
            <img className="previewImage"
                 src={!!ticketList.length ? ticketList[currentTicketId].pictureUrl : ''}
                 alt=""
                 // 打开图片弹窗
                 onClick={ () => { this.setState({showImageViewer: true,}) } }
                 style={{
                   width: previewImageWH === 'width' ? '100%' : 'auto',
                   height: previewImageWH === 'height' ? '100%' : 'auto',
                 }}
            />
          </div>

          {/*表单功能*/}
          <div className="containerBody containerForm">
            <Form className="examineForm"
                  id='myForm'
            >
              <FormItem label="商场"
                        colon
                        labelCol={{span: 2}}
              >
                <Input style={{width: 150, marginLeft: 10, marginRight: 20, color: '#555'}}
                       disabled
                       value={currentShop}
                />
              </FormItem>
              <FormItem label="请输入凭证号"
                        colon
                        labelCol={{span: 6}}
                        wrapperCol={{span: 12}}
              >
                {getFieldDecorator('teamNo', {
                  initialValue: '',
                  rules: [
                    {required: true, message: '请输入凭证号!'}
                  ],
                })(
                  <Input style={{width: 180, marginLeft: 10, color: '#555'}}
                         placeholder="请输入凭证号"
                  />
                )}
              </FormItem>

              <FormItem label="小票购买时间"
                        colon
                        labelCol={{span: 6}}
                        wrapperCol={{span: 5}}
              >
                {getFieldDecorator('ticketDate', {
                  rules: [{required: true}],
                  initialValue: moment(new Date())
                })(
                  <DatePicker style={{width: 130,marginLeft: 10}}
                              dropdownClassName="datePickerPopup"
                              allowClear={false}
                              disabledDate={this.disabledDate}
                              onChange={this.changeTicketDate.bind(this)}
                  />
                )}
              </FormItem>

              <MoneyCalculation brandListOrigin={brandListOrigin}
                                ticketDate={ticketDate}
                                country={country}
                                currentShop={currentShop}
                                changeReciptMoney={this.changeReciptMoney.bind(this)}
                                hasChange={hasChange}
                                repeatList={repeatList}
                                emptyList={emptyList}
              />

              {/* 韩国专有属性 */}
              {country === '韩国' && <FormItem label="属性"
                                             colon
                                             labelCol={{span: 2}}
              >
                {getFieldDecorator('reciptAttribute', {
                  rules: [{required: true}],
                  initialValue: 'SG'
                })(
                  <Select style={{width: 100, marginLeft: 10}}
                  >
                    <Option key="SG">SG</Option>
                    <Option key="MG">MG</Option>
                  </Select>
                )}
              </FormItem>}

              <FormItem label="汇率"
                        colon
                        labelCol={{span: 2}}
                        wrapperCol={{span: 20}}
              >
                {getFieldDecorator('exchangeRate', {
                  rules: [
                    {required: true},
                    {validator: this.exchangeRateValidator.bind(this)}
                  ],
                  initialValue: defaultExchangeRate
                })(
                  <Input style={{width: 100, marginLeft: 10}}
                         type="number"
                         id="exchangeRate"
                         placeholder="请输入汇率"
                         // 修正汇率触发
                         onChange={ () => this.changeReciptMoney() }
                  />
                )}
              </FormItem>

              {/* 显示返点金额 */}
              <p>
                <span style={{marginLeft: 10,color: '#999'}}>返点金额(¥)：{reciptMoney}</span>
              </p>

              <FormItem>
                <Button type="primary"
                        htmlType="submit"
                        className="examineFormButton"
                        style={{marginTop: '15px', marginLeft: '10px'}}
                        onClick={this.handleSubmit.bind(this)}
                >
                  通过
                </Button>
                <Button type="danger"
                        // 打开驳回原因窗口
                        onClick={ () => this.setState({remarks: 'showRemark'}) }
                        style={{marginLeft: '20px'}}
                >
                  驳回
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>

        {/* 驳回相关模块 */}
        <div className={this.state.remarks + ' popup'}>
          <div className='remark-title'>
            <Icon type='close'
                  // 关闭驳回原因选择窗口
                  onClick={ () => this.setState({remarks: 'unShow'}) }
            />
            <span>请选择驳回原因</span>
          </div>
          <RadioGroup className='allReasons'
                      onChange={ (e) => { this.setState({reason: e.target.value}) }}
                      value={this.state.reason}
          >
            <Radio value={0}>小票不清晰</Radio>
            <Radio value={1}>凭证号不正确</Radio>
            <Radio value={2}>小票重复</Radio>
            <Radio value={3}>其他</Radio>
          </RadioGroup>
          <Button type="primary" onClick={this.openNotification.bind(this)}>确定</Button>
        </div>

        {/* 图片查看弹窗组件 */}
        {showImageViewer &&
        <ImageViewer // 图片链接, 上为图片查看器开关
          imgSrc={!!ticketList.length ? ticketList[currentTicketId].pictureUrl : ''}
          // 关闭图片查看
          closeImageViewer={() => this.setState({showImageViewer: false,}) }
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