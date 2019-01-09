import React from 'react';
import {Select, Button, Table, message, Pagination, Form, Modal, Input, Icon, } from 'antd';
import moment from 'moment';
import {inject, observer} from 'mobx-react/index';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 正则小计(中文+韩文+英文+数字+()（）_/):
//
// new RegExp('^[\u4e00-\u9fa5]|[\uac00-\ud7a3]|[a-zA-Z0-9]|[\(\)\-\_\/]+$')
// 中文: [\u4e00-\u9fa5]
// (包括所有中文汉字,日文汉字,韩文汉字, 根据系统文字显示相应汉字字符样式)
// 韩文: [\uac00-\ud7a3]
// 日文: [\u3041-\u30ff]
// 中文括号(即（）): [\uff08\uff09]
// 正整数正则: /^[1-9]\d*$/

@inject('appStore') @observer @Form.create()
class setRebate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 分页相关
      pageSize: 20,
      pageNum: 1,
      pageTotal: 0,
      // 商场列表
      shopList: [],
      // 当前选择的商场
      currentShop: '',
      // 品牌列表
      tableDataList: [],
      // 弹窗标题
      modalTitle: '新增返点信息',
      // 弹窗开关
      modalVisible: false,
      // 弹窗类型
      modalType: 'create',
      // 编辑所需额外字段
      modalEditData: {},
    };
  }
  // 加载商场列表
  componentWillMount() {
    fetch(window.fandianUrl + '/mall/getMallList', {
      method: 'POST'
    }).then(r => r.json()).then(r => {
      if (r.retcode.status === '10000') {
        let dataList = [];
        for (let i of r.data) {
          dataList.push(<Option key={i.mallId} value={i.mallName}>{i.mallName}</Option>)
        }
        this.setState({
          shopList: dataList
        })
      } else {
        message.error(`${r.retcode.msg},状态码为:${r.retcode.status}`)
      }
    })
  }
  // 选择商场触发
  selectShop(shopName,target) {
    let {pageSize} = this.state;
    this.selectAllRebateByMallName(1,pageSize,shopName)
    this.props.form.setFieldsValue({
      'mallName':shopName
    })
  }
  // 根据商场获取品牌列表
  selectAllRebateByMallName(pageNum=this.state.pageNum,pageSize=this.state.pageSize,shopName=this.state.currentShop) {
    fetch(window.fandianUrl + '/rebate/selectAllRebateByMallName', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // 这里给出搜索的页码与当前页数
      body: `mallName=${shopName}&pageSize=${pageSize}&pageNum=${pageNum}`,
    }).then(r => r.json()).then(r => {
      if (r.status === 10000) {
        this.setState({
          currentShop: shopName,
          pageTotal: r.data.total,
          pageSize: r.data.pageSize,
          pageNum: r.data.pageNum,
          tableDataList: r.data.list,
        })
      }
    })
  }
  // 分页操作
  changePage(pageNum,pageSize) {
    this.selectAllRebateByMallName(pageNum,pageSize)
  }
  changePageSize(pageNum,pageSize) {
    this.selectAllRebateByMallName(pageNum,pageSize)
  }
  // 打开编辑弹窗
  openEdit(q) {
    this.setState({
      modalType: 'edit',
      modalVisible: true,
      modalEditData: {
        brandId: q.brandId,
        rebateId: q.rebateId
      }
    });
    this.props.form.setFieldsValue({
      mallName: q.mallName,
      brandName: q.brandName,
      productCode: q.productCode,
      rebateRate: q.rebateRate,
      brandType: q.brandType,
    })
  }
  // 打开新增弹窗
  openCreate() {
    this.setState({
      modalType: 'create',
      modalVisible: true,
    })
  }
  // 关闭弹窗
  closeModal() {
    const { setFieldsValue, resetFields, } = this.props.form;
    const { currentShop } = this.state;
    this.setState({
      modalVisible: false,
    });
    // 重置表单
    resetFields();
    // 判断是否已选商场
    if (!!currentShop) setFieldsValue({'mallName': currentShop});
  }
  // 品牌名称验证
  brandNameValidator(rule, val, callback) {
    let ruleMain = new RegExp('^[\u4e00-\u9fa5]|[\u3041-\u30ff]|[\uac00-\ud7a3]|[a-zA-Z0-9]|[()（）_/]|-|\\s+$');
    let l = 0;
    for (let i = 0; i < val.length; i++) {
      // charCodeAt(): 获取某一位置的字符, 并判断他的字符码
      let sl = val.charCodeAt(i);
      if (sl >= 0 && sl <= 128) {
        l++
      } else {
        l += 2;
      }
    }
    if (ruleMain.test(val)) {
      if (l <= 64) {
        callback();
        this.props.form.setFieldsValue({brandName: val.trim()});
        document.querySelector('#brandName').value = val.trim();
      } else {
        callback('字符长度超过64位!')
      }
    } else if (val === '') {
      callback('')
    } else {
      callback('品牌名称为中文,韩文,英文,数字以及 ()（）-_ /,且不能包含空格')
    }
  }
  // 商品码验证
  productCodeValidator(rule, val, callback) {
    let ruleMain = new RegExp('^[a-zA-Z0-9]+$');
    if (ruleMain.test(val)) {
      if (val.length <= 20) {
        callback()
      } else {
        callback('商品码不能超过20位')
      }
    } else if (val === '') {
      callback()
    } else {
      callback('商品码为字母和数字组合')
    }
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
      callback('返点率最多保留一位小数')
    }
  }
  // 提交表单
  submitForm() {
    const { validateFields, } = this.props.form;
    const { modalType, modalEditData, } = this.state;
    validateFields((err, val) => {
      if (!err) {
        let dataList = val;
        if (modalType==='edit') {
          dataList.brandId = modalEditData.brandId;
          dataList.rebateId = modalEditData.rebateId
        }
        // 品牌名放开空格, 去头尾空格
        fetch(window.fandianUrl+'/rebate/insertOrUpdateRebate',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataList),
        }).then(r=>r.json()).then(r=>{
          message.success(`${ modalType==='create' ? '新增' : '编辑' }成功!`)
          // 关闭弹窗
          this.closeModal();
        });
      }
    })
  }
  render() {
    // 表单标题
    const columns=[
      {title: '商场', dataIndex: 'mallName', key: 'mallName', width: 160},
      {title: '品牌', dataIndex: 'brandName', key: 'brandName', },
      {title: '商品码', dataIndex: 'productCode', key: 'productCode', width: 80},
      {title: '最近更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 200,
      render: (text, record) => (
          <div>{moment(record.updateTime).format('YYYY-MM-DD hh:mm:ss')}</div>
      )
      },
      {title: '返点率', dataIndex: 'rebateRate', key: 'rebateRate', width: 100},
      {title: '操作', dataIndex: '操作', key: '操作', width: 150,
        render: (text, record) => (
          <div>
            <Button type="primary"
                    style={{'margin':0}}
                    onClick={this.openEdit.bind(this,record)}
            >编辑</Button>
          </div>
        ),
      }
    ];
    const {shopList, currentShop, tableDataList, pageTotal, pageSize, pageNum, modalTitle, modalVisible, modalType,  } = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="setRebate">
        <div className="shopSelect">
          <span>所属商场: </span>
          <Select className="selectShops"
                  placeholder="请选择商场"
                  onChange={this.selectShop.bind(this)}
          >
            {shopList}
          </Select>
        </div>

        <div className="btnLine">
          <Button className="createNew" type="primary"
                  onClick={this.openCreate.bind(this)}
          >新增品牌</Button>
        </div>

        {/*表单*/}
        <Table className="tableList"
               dataSource={tableDataList}
               columns={columns}
               pagination={false}
               bordered
               scroll={{ y: 600 }}
               rowKey={(record, index) => `id_${index}`}
               locale={{
                 emptyText: <div className="noShop">
                   {!currentShop && <div className="noShopDiv"><Icon type="shop" className="iconShop"/><span>请选择商场</span></div>}
                 </div>,
               }}
        />

        {/*分页*/}
        <Pagination className="tablePagination"
                    total={pageTotal}
                    pageSize={pageSize}
                    current={pageNum}
                    showTotal={(total, range) => `${range[1] === 0 ? '' : `当前为第 ${range[0]}-${range[1]} 条 ` }共 ${total} 条记录`}
                    style={{float:'right',marginRight:'20px',marginTop:'10px'}}
                    onChange={this.changePage.bind(this)}
                    showSizeChanger
                    pageSizeOptions={['10','20','30','40']}
                    onShowSizeChange={this.changePageSize.bind(this)}
        />

        {/*弹窗*/}
        <Modal width={320}
               title={
                 <div style={{fontSize:20,textAlign:'center'}}>{modalType === 'create' ? '新增' : '编辑'}返点信息</div>
               }
               visible={modalVisible}
               onCancel={this.closeModal.bind(this)}
               centered
               wrapClassName="modalWrap"
               closable={false}
               footer={
                 <div style={{textAlign:'center'}}>
                   <Button type="primary" onClick={this.submitForm.bind(this)}>保存</Button>
                   <Button style={{marginLeft:20}} onClick={this.closeModal.bind(this)}>取消</Button>
                 </div>
               }
        >
          <Form>
            <FormItem label="商场名称"
                      colon
                      labelCol={{span: 7}}
                      wrapperCol={{span: 12}}
            >
              {getFieldDecorator('mallName', {
                rules: [{required: true, message: '请选择商场!'}],
              })(
                  <Select style={{width: 180}}
                          placeholder="请选择商场"
                  >
                    {shopList}
                  </Select>
              )}
            </FormItem>
            <FormItem label="品牌类型"
                      colon
                      labelCol={{span: 7}}
            >
              {getFieldDecorator('brandType', {
                rules: [{required: true}],
                initialValue: 0
              })(
                  <Select style={{width: 180}}
                  >
                    <Option key="普通品牌" value={0} >普通品牌</Option>
                    <Option key="特殊品牌" value={1} >特殊品牌</Option>
                  </Select>
              )}
            </FormItem>
            <FormItem label="品牌名称"
                      colon
                      labelCol={{span: 7}}
                      wrapperCol={{span: 12}}
                      validator={this.brandNameValidator}
            >
              {getFieldDecorator('brandName', {
                rules: [
                  {required: true, message: '请输入品牌名称!'},
                  {validator: this.brandNameValidator.bind(this)}
                ],
              })(
                  <Input style={{width: 180}}
                         placeholder="请输入品牌名称"
                  />
              )}
            </FormItem>
            <FormItem label="商品码"
                      colon
                      labelCol={{span: 7}}
                      wrapperCol={{span: 12}}
                      validator={this.productCodeValidator}
            >
              {getFieldDecorator('productCode', {
                rules: [
                  // {required: true, message: '请输入商品码!'},
                  {validator: this.productCodeValidator.bind(this)}
                ],
              })(
                  <Input style={{width: 180}}
                         id="productCode"
                         placeholder="请输入商品码"
                  />
              )}
            </FormItem>
            <FormItem label="返点率"
                      colon
                      labelCol={{span: 7}}
                      wrapperCol={{span: 15}}
                      validator={this.rebateRateValidator}
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
                         // onChange={this.changeRebateRate.bind(this)}
                  />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default setRebate;