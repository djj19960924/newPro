import React from 'react';
import { Button, Form, Select, Input, InputNumber, Upload, message, Icon, Modal, } from 'antd';
import {inject, observer} from 'mobx-react/index';

import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

@inject('appStore') @observer @Form.create()
class commoditiesCreateAndEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // 公共传参
      type: 'create',
      skuId: 'null',
      // 标题显示
      titleName: '录入',
      // 图片地址
      imgList: [],
      // 图片预览
      previewVisible: false,
      // 预览图片地址
      previewImage: '',
      // 预览图片宽高比
      previewImageWH: [],
      // 货币类型
      currencyType: 0,
      // 行邮税号
      postcode: '',
      // Loading状态
      isLoading: false,
      // Loading提示文字
      loadingTxt: 'Loading...'
    };
    window.commoditiesCreateAndEdit = this;

  }
  // 组件加载前触发
  componentWillMount() {
    const type = window.getQueryString('type');
    const skuId = window.getQueryString('skuId');
    // 延时控制message删除
    // 用于上传大文件时给出loading的提示
    // message.loading('loading...',0,() => {console.log('关闭啦!')});
    // setTimeout(() => {
    //   message.destroy()
    // },3000);
    if (type === 'create') {
      this.setState({
        titleName: '录入',
        type: type,
        skuId: skuId,
      });
    } else if (type === 'edit') {
      // 打开loading
      this.setState({
        titleName: '编辑',
        isLoading: true,
        loadingTxt: '数据加载中, 请稍后...',
        type: type,
        skuId: skuId,
      });
      fetch(`${window.fandianUrl}/sku/selectEditSkuBySkuId`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body:`skuId=${skuId}`,
      }).then(r => r.json()).then(r => {
        // 关闭loading
        this.setState({
          isLoading: false,
          loadingTxt: 'Loading...'
        });
        if (r.status === 10000) {
          // 成功
          // 将图片地址保存在本地缓存
          const d = r.data;
          localStorage.imgList = d.imgList;
          const dataList = [];
          for (let v of d.imgList) {
            dataList.push(`//${v.split('//')[1]}`)
          }
          this.setState({
            imgList: dataList
          });
          // 这里设置表单默认值
          this.props.form.setFieldsValue({
            skuCode: d.skuCode, category: d.category, name: d.name, grossWeight: d.grossWeight, costPrice:d.costPrice, currencyType: d.currencyType, brand: d.brand, sugPostway: d.sugPostway, specificationType: d.specificationType, stock: d.stock, sugPrice: d.sugPrice, recordPrice: d.recordPrice, taxRate: d.taxRate, purchaseArea: d.purchaseArea
          });
        } else {
          // 错误,并返回错误码
          message.error(`${r.msg} 错误码:${r.status}`);
        }
      })
    } else {
      message.error('错误的商品处理类型, 即将返回商品库页面!');
      this.backTo();
    }
  }
  // 渲染成功触发
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { imgList, } = this.state;
    for (let i in imgList) {
      let item = document.getElementById(`goodsImg_${i}`);
      item.onload = (e) => {
        let the = window.commoditiesCreateAndEdit;
        let pI = document.getElementById(`goodsImg_${i}`);
        const dataList = the.state.previewImageWH;
        if ((pI.width / pI.height) < (2 / 3)) {
          dataList[i] = 'height'
        } else if ((pI.width / pI.height) >= (2 / 3)) {
          dataList[i] = 'width'
        }
        the.setState({
          previewImageWH: dataList
        },() => {
          pI.style.visibility = `visible`;
        });
      };
      item.onerror = (e) => {
        // 图片如果未加载出, 也放开显示, 标出图片未加载的默认样式
        let pI = document.getElementById(`goodsImg_${i}`);
        pI.style.visibility = `visible`;
      }
    }
  }
  // 查看图片
  imagePreview(f) {
    this.setState({
      previewImage: f,
      previewVisible: true,
    });
  }
  // 关闭图片预览
  closePreview() {
    this.setState({
      previewVisible: false,
    })
  }
  // 返回上一个界面
  backTo() {
    // this.props.history.goBack()
    // 输入准确地址, 以保证返回按钮只能回到具体页面
    this.props.history.push('/commodities-manage/commodities-database')
  }
  // 进入编辑图片界面
  gotoEditImg() {
    const { type, skuId } = this.state;
    this.props.history.push(`/commodities-manage/commodities-database/commodities-img-list?type=${type}&skuId=${skuId}`);
  }
  // 改变行邮税号
  changePostcode(v) {
    this.setState({
      postcode: v.target.value
    })
  }
  // 提交按钮
  submit() {
    // if (!this.state.isFileListChanged) {
    // fetch() 上传图片
    // .then(message.destory();message.success('图片上传成功');message.loading('表单上传中');
    // this.submitForm()
    // )} 上传表单
    // else {
    // this.submitForm()
    // }
  }
  // 上传表单
  submitForm() {
    // fetch()
  }
  // 测试用function
  test() {
    console.log(this.state);
    console.log(this.props.form.getFieldsValue())
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const { titleName, currencyType, postcode, isLoading, loadingTxt, imgList, previewVisible, previewImage, previewImageWH, } = this.state;
    return (
      <div className="commoditiesCreateAndEdit">
        {/*loading遮罩层*/}
        {isLoading && <div className="loading">
          <div className="loadingMain">
            <Icon type="loading" /> {loadingTxt}
          </div>
        </div>}

        {/*标题*/}
        <p className="titleName">商品{titleName}</p>

        {/*表单*/}
        <div className="formList">
          <Form>
            {/*商品条形码*/}
            <FormItem label="商品条形码"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 12}}
            >
              {getFieldDecorator('skuCode')(
                <Input style={{width: 180}}
                       placeholder="这里输入商品条形码"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*商品名称*/}
            <FormItem label="商品名称"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 12}}
            >
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: '请输入商品名称!'},
                ],
              })(
                <Input style={{width: 180}}
                       placeholder="请输入商品名称"
                />
              )}
            </FormItem>

            {/*商品照片*/}
            <FormItem colon
                      // label="商品照片(1-3张)"
                      label={<span className="ant-form-item-required">商品照片(1-3张)</span>}
                      labelCol={{span: 4}}
                      wrapperCol={{span: 20}}
                      className="imgList"
            >
              {imgList.length === 0 ? '' :
              imgList.map((item,i) => (
                <div className="imgDiv"
                     key={`id_${i}`}
                >
                  <img src={item}
                       id={`goodsImg_${i}`}
                       style={{
                         width: previewImageWH[i] === 'width' ? '100%' : 'auto',
                         height: previewImageWH[i] === 'height' ? '100%' : 'auto',
                         visibility: `hidden`,
                       }}
                       onClick={this.imagePreview.bind(this,item)}
                  />
                </div>
              ))}
              <Button type="primary"
                      onClick={this.gotoEditImg.bind(this)}
              >编辑商品照片</Button>
            </FormItem>

            {/*图片预览*/}
            <div>
              {/*图片预览弹窗*/}
              <Modal visible={previewVisible}
                     footer={null}
                     onCancel={this.closePreview.bind(this)}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>

            {/*毛重*/}
            <FormItem label="毛重(kg)"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 12}}
            >
              {getFieldDecorator('grossWeight', {
                rules: [
                  {required: true, message: '请输入重量!'},
                ],
              })(
                <Input style={{width: 180}}
                       placeholder="请输入重量"
                       type="number"
                />
              )}
            </FormItem>

            {/*成本价 / 采购价*/}
            <FormItem label="成本价/采购价"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('costPrice', {
                rules: [
                  {required: true, message: '请输入成本价/采购价!'},
                ],
              })(
                <Input style={{width: 180}}
                       placeholder="请输入成本价/采购价"
                       type="number"
                />
              )}
              {/*选择货币类型*/}
              <Select className="currencyTypeSelect"
                      style={{width: 100,marginLeft: 10}}
                      // 当存在 defaultValue 时, 则无需 placeholder
                      defaultValue={0}
                      Value={currencyType}
                      onChange={(v) => this.setState({currencyType: v})}
              >
                <Option value={0}>人民币</Option>
                <Option value={1}>美元</Option>
                <Option value={2}>欧元</Option>
                <Option value={3}>日元</Option>
                <Option value={4}>韩币</Option>
                <Option value={5}>港币</Option>
              </Select>
            </FormItem>

            {/*选择商品品牌*/}
            <FormItem label="商品品牌"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('brand', {
                rules: [
                  {required: true, message: '请输入商品品牌!'},
                ],
              })(
                <Input style={{width: 180}}
                       placeholder="请输入商品品牌"
                />
              )}
            </FormItem>

            {/*选择商品品类*/}
            <FormItem label="品类"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('category', {
                rules: [
                  {required: true, message: '请输入品类!'},
                ],
              })(
                <Input style={{width: 180}}
                       placeholder="请输入品类"
                />
              )}
              <span style={{marginLeft: 10,color: 'rgba(0,0,0,.85)'}}>行邮税号 : </span>
              <Input style={{width: 180}}
                     placeholder="请输入行邮税号"
                     value={postcode}
                     onChange={this.changePostcode.bind(this)}
              />
            </FormItem>

            {/*建议行邮方式*/}
            <FormItem label="建议行邮方式"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('sugPostway')(
                <Input style={{width: 180}}
                       placeholder="请输入建议行邮方式"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*规格型号*/}
            <FormItem label="规格型号"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('specificationType')(
                <Input style={{width: 180}}
                       placeholder="请输入规格型号"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*数量 / 库存*/}
            <FormItem label="数量 / 库存"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('stock')(
                <Input style={{width: 180}}
                       placeholder="请输入数量"
                       type="number"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*建议ETK申报价*/}
            <FormItem label="建议ETK申报价"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('sugPrice')(
                <Input style={{width: 180}}
                       placeholder="请输入建议ETK申报价"
                       type="number"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*备案价*/}
            <FormItem label="备案价"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('recordPrice')(
                <Input style={{width: 180}}
                       placeholder="请输入备案价"
                       type="number"
                />
              )}
              <span style={{marginLeft: 10}}>(未备案则先不填写)</span>
            </FormItem>

            {/*税率*/}
            <FormItem label="税率"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('taxRate')(
                <Input style={{width: 180}}
                       placeholder="税率"
                       type="number"
                />
              )}
              <span style={{marginLeft: 10}}>(未备案则先不填写)</span>
            </FormItem>

            {/*采购地*/}
            <FormItem label="采购地"
                      colon
                      labelCol={{span: 4}}
                      wrapperCol={{span: 15}}
            >
              {getFieldDecorator('purchaseArea')(
                <Input style={{width: 180}}
                       placeholder="采购地"
                />
              )}
              <span style={{marginLeft: 10}}>(选填)</span>
            </FormItem>

            {/*提交按钮*/}
            <FormItem>
              <Button type="primary"
                      onClick={this.submitForm.bind(this)}
              >提交</Button>
              <Button type="primary"
                      onClick={this.backTo.bind(this)}
                      style={{marginLeft: 20}}
              >返回上一个页面</Button>
              <Button onClick={this.test.bind(this)}
                      style={{marginLeft: 20}}
              >test!</Button>
            </FormItem>

          </Form>
        </div>

      </div>
    );
  }
}

export default commoditiesCreateAndEdit;