import React from 'react';
import { Form, Icon, Input, InputNumber, Button, Checkbox, message, Select, DatePicker, } from 'antd';
import moment from 'moment';
import ImageViewer from '@components/imageViewer/main';
import { inject, observer } from 'mobx-react/index';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

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
class awaitingExamine extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 图片查看器开关
      showImageViewer: false,
      // 当前图片地址
      imgSrc: require('@img/avatar.png'),
      // 商场列表
      shopList: [],
      // 当前所选商场
      currentShop: '',
      // 消费金额
      totalMoney: null,
      // 是否有剩余的小票
      hasTicket: false,
      // 剩余小票列表
      ticketList: [],
      // 已完成小票数
      ticketDone: null,
      // 当前小票
      currentTicket: 0,
    };
  }
  componentWillMount() {
    fetch(window.theUrl+'/mall/getMallList',{
      method:'POST'
    }).then(r => r.json()).then(r=>{
      // console.log(r)
      if (r.retcode.status === '10000') {
        // message.success(r.retcode.msg)
        let dataList = [];
        for ( let i of r.data ) {
          // console.log(i)
          dataList.push(<Option key={i.mallId} value={i.mallName}>{i.mallName}{i.mallCity && (' '+i.mallCity)}</Option>)
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
    fetch(window.theUrl+'/brand/getBrandList',{
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: 'mallName=' + val + '&pageNum=1&pageSize=20',
    }).then(r => r.json()).then(r=>{
      if (r.retcode.status === '10000') {
        if (r.data) {
          this.setState({
            ticketList: r.data,
            hasTicket: true,
            currentShop: val
          });
        } else {
          return
        }
      }
    })
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
  // 消费金额验证格式
  setTotalMoney(event) {
    let val = event.target.value;
    // 正则, 输入为数字, 最多可至小数点后两位
    let rule = /^\d+(\.\d{0,2})?$/;
    // this.setState({
    //   totalMoney: val,
    // })
    if (rule.test(val)) {
      // 当字符串通过正则时
      if (parseFloat(val) < 999999) {
        this.setState({
          totalMoney: val,
        })
      }
    }
  }
  // 日期选择器范围
  disabledDate(current) {
    return current && current > moment().endOf('day');
  }
  // 提交表单
  handleSubmit() {
    console.log('提交!');
    console.log(this.props.form.getFieldsValue())
  }
  render() {
    let { showImageViewer, imgSrc, shopList, totalMoney, currentShop, hasTicket, } = this.state;
    return (
      <div className="awaitingExamine">
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
        </div>
        <div className="noTicket" style={{display:(hasTicket ? 'none' : 'block')}}>
          {currentShop && <div><Icon type="smile" className="iconSmile" /><span>当前商场没有小票</span></div>}
          {!currentShop && <div><Icon type="shop" className="iconShop" /><span>请选择商场</span></div>}
        </div>
        <div className="container" style={{display:(hasTicket ? 'block' : 'none')}}>
          <div className="containerBody containerImage">
            {/*单图片功能*/}
            <img className="previewImage"
                 src={imgSrc}
                 alt=""
                 onClick={this.openImageViewer.bind(this)}
            />
          </div>
          <div className="containerBody containerForm">
            <Form onSubmit={this.handleSubmit.bind(this)} className="examineForm">
              <FormItem>
                <div style={{width:200,float:'left'}}>商场: {currentShop} </div>
                <div style={{width:100,float: 'left'}}>团号: {}</div>
              </FormItem>
              <FormItem>
                <span>消费金额: </span>
                <Input style={{ width: 120 }}
                       type="number"
                       value={totalMoney}
                       placeholder="请输入消费金额"
                       onChange={this.setTotalMoney.bind(this)}
                />
                <span> $ </span>
                <span>属性: </span>
                <Select style={{ width: 70}}
                        defaultValue="SG"
                >
                  <Option key="SG" >SG</Option>
                  <Option key="MG" >MG</Option>
                </Select>
              </FormItem>
              <FormItem>
                <span>品牌: </span>
                <Select style={{ width: 240 }}
                        placeholder="请输入编码/品牌查询"
                >
                  {/*这里根据获取品牌数组遍历结果*/}
                </Select>
              </FormItem>
              <FormItem>
                <span>选择日期: </span>
                <DatePicker style={{ width: 120 }}
                            allowClear={false}
                            defaultValue={moment(new Date())}
                            disabledDate={this.disabledDate}
                />
                <span>返点率: </span>
                <Input defaultValue={15/*这里默认显示当天返点率*/}
                             style={{ width: 50 }}
                />
                <span> %</span>
              </FormItem>
              <FormItem>
                <Button type="primary"
                        htmlType="submit"
                        className="examineFormButton"
                        style={{marginTop: '10px'}}
                >
                  通过
                </Button>
                <Button type="danger">
                  驳回
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>

        {showImageViewer &&
        <ImageViewer // 图片链接, 上为图片查看器开关
                     imgSrc={imgSrc}
                     // 关闭图片查看
                     closeImageViewer={()=>this.closeImageViewer()}
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