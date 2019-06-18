import React from 'react';
import { message, Icon, Button, Row, Col, InputNumber, Modal, } from 'antd';
import allowedKeys from "@js/allowedKeys/";
import './index.less';

class SKTCommoditiesInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxesIsLoading: false,
      productNum: 0,
      isFocusOnWindow: true
    };
  }

  componentDidMount() {
    this.loadKeyListener();
    window.onblur = () => {
      // console.log(`失去焦点!`);
      this.setState({isFocusOnWindow: true})
    };
  }

  // 用于卸载扫码器扫码功能
  unloadKeyListener() {
    window.onkeyup=window.onkeydown=null;
  }

  // 用于读取并处理扫码器扫取内容
  loadKeyListener() {
    // 加载监听器时, 建议先将监听部分内容清空
    this.unloadKeyListener();
    let onKeyDownTime = null, onKeyDownKey = null, lastInputTime = null, inputValue = ``;
    window.onkeydown = (e) => {
      // console.log(e);
      if (allowedKeys.includes(e.key) || e.key === `Enter`) {
        // console.log(`按键值:"${e.key}", 按键时间:${new Date().getTime()}`);
        onKeyDownTime = new Date().getTime();
        onKeyDownKey = e.key;
      }
    };
    window.onkeyup = (e) => {
      // console.log(e);
      // 清除方法
      let clearData = () => {
        inputValue = ``;
        lastInputTime = null;
        this.setState({loadingShow: false});
      };
      // 判断
      if (allowedKeys.includes(e.key)) {
        // console.warn(`按键值:"${e.key}", 起键时间:${new Date().getTime()}`);
        if ((new Date().getTime() - onKeyDownTime) <= 12) {
          if (lastInputTime === null || (new Date().getTime() - lastInputTime) <= 50)
            if (onKeyDownKey === e.key.toUpperCase()) {
              this.setState({loadingShow: true});
              inputValue += e.key.toUpperCase();
              lastInputTime = new Date().getTime();
            } else {
              // 输入间隔过大时, 删除判断时间以作保险
              lastInputTime = null;
              inputValue = ``;
            }
        }
      } else if (e.key === `Enter`) {
        if ((new Date().getTime() - onKeyDownTime) <= 12) {
          if (onKeyDownKey === e.key && (new Date().getTime() - lastInputTime) <= 50) {
            // 在这里识别所获取的value值, 当判断为箱号或商品条形码时, 进行接口调取动作
            // let ruleNumber = /^[0-9]+$/;
            let ruleBox = /^BH+/;
            if (ruleBox.test(inputValue)) {
              // 箱号判断, 调取接口添加箱子至该用户名下
              if (inputValue.length === 14) {
                // message.success(`识别为箱号: ${inputValue}`);
                console.log(inputValue);
              } else {
                message.error(`识别为箱号, 但是长度不正确, 请重新扫描`);
              }
            } else {
              // 商品条码判断, 调取接口添加商品进当前箱子
              // message.success(`识别为条形码: ${inputValue}`);
              console.log(inputValue);
            }
            clearData();
          }
        }
      }
    }
  }

  // 录入商品
  entryProduct() {
    const {parcelCode, productCode} = this.state;
    const data = {parcelCode, productCode};
    this.ajax.post('/backend/SktProductManage/entryProduct', data).then(r => {
      if (r.data.status === 10000) {
        //
      }
      r.showError();
    }).catch(r => {
      console.error(r);
      this.ajax.isReturnLogin(r, this);
    });
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    // 组件关闭以后, 卸载window事件
    this.unloadKeyListener();
    // 卸载异步操作设置状态
    this.setState = () => null
  }
  render() {
    const {boxesIsLoading, productNum, isFocusOnWindow} = this.state;
    return (
      <div className="SKTCommoditiesInput">
        <div className="title">
          <div className="titleMain">扫码录入商品</div>
          <div className="titleLine" />
        </div>
        <div className="main">
          {/*存放加载提示图标*/}
          {boxesIsLoading &&
          <div className="loading">
            <Icon type="loading" />
          </div>
          }
          {/*箱子内部*/}
          <div className="boxes">
            <div className="box">
              <Row className="boxTitleLine boxInfo" >
                <Col span={8} className="boxNum">箱号: BH123456789123</Col>
                <Col span={6} title="qqz">客户昵称: qqz</Col>
                <Col span={10}>订单时间: 2019-06-14 13:42:13</Col>
              </Row>
              <Row className="boxTitleLine" >
                <Col span={3} >
                  <span>序号</span>
                </Col>
                <Col span={6} >
                  <span>商品条码</span>
                </Col>
                <Col span={10} >
                  <span>商品名称</span>
                </Col>
                <Col span={5} >
                  <span>数量</span>
                  {/*这里动态添加商品数量提示*/}
                  {null && '这里动态添加商品数量提示'}
                </Col>
              </Row>
              <div className="boxMain">

                <Row className={`commoditiesInfo commoditiesInfo_0 rowLineColor_${(0 + 1) % 2 !== 0 ? 'light' : 'dark'}`}
                >
                  <Col className="infoCol" span={3}>1</Col>
                  <Col className="infoCol" span={6}>BH123456789123</Col>
                  <Col className="infoCol" span={10} title={'测试商品1'}>测试商品1</Col>
                  <Col className="infoCol" span={5}>
                    <div className="btnPM" style={{marginRight: 10}}
                         // onClick={this.changeProductNumber.bind(this,'minus',commoditiesItem.productCode,boxItem.parcelNo)}
                    >-</div>
                    {/*{commoditiesItem.productNum}*/}
                    3
                    <div className="btnPM" style={{marginLeft: 10}}
                         // onClick={this.changeProductNumber.bind(this,'plus',commoditiesItem.productCode,boxItem.parcelNo)}
                    >+</div>
                  </Col>
                </Row>

                <Row className={`commoditiesInfo commoditiesInfo_1  rowLineColor_${(1 + 1) % 2 !== 0 ? 'light' : 'dark'}`}
                >
                  <Col className="infoCol" span={3}>2</Col>
                  <Col className="infoCol" span={6}>BH123456789124</Col>
                  <Col className="infoCol" span={10} title={'测试商品2'}>测试商品2</Col>
                  <Col className="infoCol" span={5}>
                    <div className="btnPM" style={{marginRight: 10}}
                    >-</div>
                    12
                    <div className="btnPM" style={{marginLeft: 10}}
                    >+</div>
                  </Col>
                </Row>

                <Row className={`commoditiesInfo commoditiesInfo_1  rowLineColor_${(2 + 1) % 2 !== 0 ? 'light' : 'dark'}`}
                >
                  <Col className="infoCol" span={3}>3</Col>
                  <Col className="infoCol" span={6}>BH123456789125</Col>
                  <Col className="infoCol" span={10} title={'测试商品3'}>测试商品3</Col>
                  <Col className="infoCol" span={5}>
                    <div className="btnPM" style={{marginRight: 10}}
                    >-</div>
                    4
                    <div className="btnPM" style={{marginLeft: 10}}
                    >+</div>
                  </Col>
                </Row>

              </div>
            </div>
          </div>
          {/*包裹信息*/}
          <div className="packInfo">
            <div className="packInfoLine">
              <span>物流方案: BC</span>
            </div>
            <div className="packInfoLine">
              <span>共 {productNum} 件商品, </span>
              <Button type="danger"
                      style={{marginLeft: 10}}
              >退出</Button>
              <Button type="primary"
                      style={{marginLeft: 10}}
                      // onClick={this.createOrder.bind(this)}
              >完成</Button>
            </div>
          </div>
        </div>

        {isFocusOnWindow &&
        // 遮罩层, 用于保证用户焦点停留于该页面中, 否则显示该遮罩, 并提示需要点击
        <div className="isFocusOnWindow"
             onClick={() => this.setState({isFocusOnWindow: false})}
        >
          <p className="focusInfo"><Icon type="info-circle" /> 请点击屏幕, 以便确保页面可以获取扫码器数据</p>
        </div>
        }
      </div>
    );
  }
}

export default SKTCommoditiesInput;