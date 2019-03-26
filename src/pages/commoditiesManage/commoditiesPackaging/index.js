import React from 'react';
import { message, Icon, Button, Row, Col, InputNumber, } from 'antd';
import allowedKeys from "@js/allowedKeys";

import './index.less';
class commoditiesPackaging extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 判断页面是否为激活状态, 当 window 失去焦点时, 页面进入待机遮罩状态
      isFocusOnWindow: true,
      // 加载显示
      loadingShow: false,
      unionId: null,
      nickname: null,
      // 用户下箱子以及商品信息
      boxesList: [],
      // 当前所选箱号
      selectBox: ``,
    };
    window.commoditiesPackaging = this;
  }

  componentDidMount() {
    let unionId = null,nickname =null;
    if (window.getCookie('unionId') !== null) {
      unionId = window.getCookie('unionId');
      nickname = window.getCookie('nickname');
    } else if (window.getQueryString('unionId') !== null) {
      unionId = window.getQueryString('unionId');
      nickname = window.getQueryString('nickname');
      window.setCookie('unionId',unionId,7200);
      window.setCookie('nickname',nickname,7200);
    } else {
      message.warn(`请用户登陆`);
      this.props.history.push(`/commodities-manage/commodities-packaging/customer-login`);
      return false
    }
    this.setState({unionId:unionId,nickname:nickname},()=>{
      this.getParcelProductListByUnionId();
    });
    this.loadKeyListener();

    window.onblur = () => {
      // console.log(`失去焦点!`);
      this.setState({isFocusOnWindow: true})
    };
  }

  // 根据unionId获取用户信息
  getParcelProductListByUnionId() {
    const { selectBox, unionId, } = this.state;
    fetch(`${window.fandianUrl}/parcelManagement/getParcelProductListByUnionId`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({unionId:unionId})
    }).then(r => r.json()).then(r => {
      // console.log(r);
      if (!r.data && !r.msg) {
        message.error(`后端返回数据错误`)
      } else {
        if (r.status === 10000) {
          this.setState({boxesList:r.data,selectBox:selectBox === '' ? r.data[0].parcelNo : selectBox})
        } else if (r.status === 10001) {
          message.success(r.msg);
          this.setState({boxesList: [],selectBox: ''})
        } else {
          message.error(`${r.msg}, 错误码: ${r.status}`);
          this.setState({boxesList: [],selectBox: ''})
        }
      }
    }).catch(() => {
      message.error(`前端接口调取失败`)
    });
  }

  // 增加箱子
  generateParcel(parcelNo) {
    const { unionId, nickname, } = this.state;
    fetch(`${window.fandianUrl}/parcelManagement/generateParcel`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        parcelNo: parcelNo,
        unionId: unionId,
        wechatName: nickname,
      })
    }).then(r => r.json()).then(r => {
      // console.log(r);
      if (!r.data && !r.msg) {
        message.error(`后端返回数据错误`)
      } else {
        if (r.status === 10000) {
          this.setState({boxesList:r.data,selectBox:r.data[`${r.data.length-1}`].parcelNo},()=>{
            window.location.hash = `box_${r.data.length-1}`
          });
        } else if (r.status > 10000) {
          message.error(`${r.msg}, 错误码: ${r.status}`)
        } else if (r.status < 10000) {
          message.warn(`${r.msg}, 状态码: ${r.status}`)
        }
      }
    }).catch(() => {
      message.error(`前端商品录入接口调取失败`)
    })

  }

  // 增加箱内指定商品数量
  changeProductNumber(type,productCode) {
    let interfaceUrl = `/productManagement/`;
    if (type === 'plus') interfaceUrl += `increaseProductNumber`;
    else if (type === 'minus') interfaceUrl += `decreaseProductNumber`;
    const { selectBox, boxesList, } = this.state;
    fetch(`${window.fandianUrl}${interfaceUrl}`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        parcelNo: selectBox,
        productCode: productCode,
      })
    }).then(r => r.json()).then(r => {
      // console.log(r);
      if (!r.data && !r.msg) {
        message.error(`后端返回数据错误`)
      } else {
        if (r.status === 10000) {
          for (let n in boxesList) if (boxesList[n].parcelNo === selectBox) {
            let dataList = boxesList;
            dataList[n].parcelProductVoList = r.data;
            this.setState({boxesList: dataList})
          }
          message.success(`${type === 'plus' ? '增加' : '减少'}商品数量成功`)
        } else if (r.status < 10000) {
          message.warn(`${r.msg} 状态码:${r.status}`)
        } else if (r.status > 10000) {
          message.error(`${r.msg} 状态码:${r.status}`)
        }
      }
    }).catch(() => {
      message.error(`前端商品录入接口调取失败`)
    })
  }

  // 商品录入
  entryProductInfo(productCode) {
    const { selectBox, unionId, nickname, boxesList, } = this.state;
    fetch(`${window.fandianUrl}/productManagement/entryProductInfo`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        parcelNo: selectBox,
        productCode: productCode,
        unionId: unionId,
        wechatName: nickname,
      })
    }).then(r => r.json()).then(r => {
      // console.log(r);
      if (!r.data && !r.msg) {
        message.error(`后端返回数据错误`)
      } else {
        if (r.status === 10000) {
          for (let n in boxesList) if (boxesList[n].parcelNo === selectBox) {
            let dataList = boxesList;
            dataList[n].parcelProductVoList = r.data;
            this.setState({boxesList: dataList})
          }
          message.success(`商品已成功录入 箱子${selectBox}`)
        } else if (r.status < 10000) {
          message.warn(`${r.msg} 状态码:${r.status}`)
        } else if (r.status > 10000) {
          message.error(`${r.msg} 状态码:${r.status}`)
        }
      }
    }).catch(() => {
      message.error(`前端商品录入接口调取失败`)
    })
  }

  // 用于卸载扫码器扫码功能
  unloadKeyListener() {
    window.onkeyup=window.onkeydown=null
  }

  // 用于读取并处理扫码器扫取内容
  loadKeyListener() {
    let onKeyDownTime = null, onKeyDownKey = null, lastInputTime = null, inputValue = ``;
    window.onkeydown = (e) => {
      if (allowedKeys.includes(e.key) || e.key === `Enter`) {
        // console.log(`按键值:"${e.key}", 按键时间:${new Date().getTime()}`);
        onKeyDownTime = new Date().getTime();
        onKeyDownKey = e.key;
      }
    };
    window.onkeyup = (e) => {
      // 清除方法
      let clearData = () => {
        inputValue = ``;
        lastInputTime = null;
        this.setState({loadingShow:false});
      };
      // 判断
      if (allowedKeys.includes(e.key)) {
        // console.warn(`按键值:"${e.key}", 起键时间:${new Date().getTime()}`);
        if ((new Date().getTime() - onKeyDownTime) <= 3) {
          // 按键: onkeydown, 起键: onkeyup
          // 这里做双重保障: 1.判断按键与起键时间差, 只有扫码才能在3ms内进行按键操作
          // 2.判断按键与起键的值, 在人手动使用键盘乱按的时候, 是有可能造成输入延迟, 导致某次起键动作被延迟
          // 从而导致按键与起键时间高度重合, 所有根据按键与起键的值(e.key)再做进一步的校验
          if (lastInputTime === null || (new Date().getTime() - lastInputTime) <= 50)
            if (onKeyDownKey === e.key) {
              this.setState({loadingShow:true});
              inputValue += e.key;
              lastInputTime = new Date().getTime();
            } else {
              // 输入间隔过大时, 删除判断时间以作保险
              lastInputTime = null;
              inputValue = ``;
            }
        }
      } else if (e.key === `Enter`) {
        if ((new Date().getTime() - onKeyDownTime) <= 3) {
          if (onKeyDownKey === e.key && (new Date().getTime() - lastInputTime) <= 50) {
            console.log(inputValue);
            // 在这里识别所获取的value值, 当判断为箱号或商品条形码时, 进行接口调取动作
            let ruleNumber = /^[0-9]+$/;
            let ruleBox = /^BH+/;
            if (ruleNumber.test(inputValue)) {
              // 商品条码判断, 调取接口添加商品进当前箱子
              if (8 <= inputValue.length <= 13) {
                console.log(`条形码: ${inputValue}`);
                this.entryProductInfo(inputValue);
              }
            } else if (ruleBox.test(inputValue)) {
              // 箱号判断, 调取接口添加箱子至该用户名下
              if (inputValue.length === 14) {
                console.log(`箱号: ${inputValue}`);
                // 判断是否已有该箱子
                let hasThisBox = false,boxNum = null
                const { boxesList, } = this.state;
                for (let n in boxesList) if (boxesList[n].parcelNo === inputValue) {
                  hasThisBox = true;
                  boxNum = n;
                }
                if (hasThisBox) {
                  this.setState({selectBox:inputValue},()=>{
                    window.location.hash = `box_${boxNum}`;
                    message.success(`选中 箱子${inputValue}`)
                  })
                } else if (!hasThisBox) this.generateParcel(inputValue);
              }
            }
            clearData();
          }
        }
      }
    };
  }

  // 退出当前用户
  loginOut() {
    window.delCookie('unionId');
    window.delCookie('nickname');
    this.props.history.push(`/commodities-manage/commodities-packaging/customer-login`);
  }

  componentWillUnmount() {
    // 组件关闭以后, 卸载window事件
    window.onkeyup = window.onkeydown = window.onblur = window.onfocus = null
  }

  render() {
    const { isFocusOnWindow, loadingShow, nickname, boxesList, selectBox, } = this.state;
    const isInputing = false;
    return (
      <div className="commoditiesPackaging ">
        {/*这里存放公共信息, 用于表示登陆用户, 以及退出登陆*/}
        <div className="titleLine">
          <h1 className="title">商品录入,箱子打包</h1>
          <div className="nickName">当前用户: {nickname}</div>
          <Button className="loginOut"
                  type="danger"
                  onClick={this.loginOut.bind(this)}
          ><Icon type="close-circle" />退出当前用户</Button>
        </div>

        {/*这里存放用户名下带发货的箱子, 商品, 以及数量价格等信息*/}
        <div className="main">
          {/*这里用作箱子信息存放*/}
          <div className="boxes">
            {/*第一层遍历, 取出所有箱子信息, 将箱号与箱内数据取出并使用*/}
            {boxesList.map((boxItem,boxKey) => {
              // console.log(boxItem);
              // console.log(boxKey);
              return (
                <div className="box"
                     id={`box_${boxKey+1}`}
                     key={`box_${boxKey}`}
                     style={{border: (boxItem.parcelNo === selectBox ? `2px solid rgba(255,0,0,.5)` : `none`)}}
                     onClick={()=>{this.setState({selectBox: boxItem.parcelNo})}}
                >
                  {/*这里用以显示箱子的公共信息, 如编号, 想箱号, 以及删除箱子按钮*/}
                  <Row className="boxTitleLine boxInfo" >
                    <Col span={3}> {boxKey+1} 号箱</Col>
                    <Col span={8}> 箱号: {boxItem.parcelNo}</Col>
                    <Col span={5}>
                      <div>
                        <span className="boxWeightInfo" style={{color:'rgba(255,0,0,.8'}}>重量: </span>
                        <InputNumber className="boxWeight"
                                     max={99.9} min={0.1}
                                     precision={0}
                                     value={boxItem.parcelWeight}
                                     onChange={(v)=>{console.log(v)}}
                                     onBlur={()=>{
                                       console.log(`onBlur ${boxKey} ${boxItem.parcelNo}`);
                                       this.loadKeyListener();
                                     }}
                                     onFocus={()=>{
                                       console.log(`onFocus ${boxKey} ${boxItem.parcelNo}`);
                                       this.unloadKeyListener();
                                     }}
                        />
                        <span className="boxWeightUnit">Kg</span>
                      </div>
                      <div>

                      </div>
                    </Col>
                    <Col span={5}>
                      {boxItem.parcelNo === selectBox ? <span style={{color:'rgba(255,0,0,.6)'}}>当前所选箱子</span> : ``}
                    </Col>
                    <Col span={3}>
                      <Button type="danger"
                              size="small"
                              className="delBox"
                              disabled={true}
                      ><Icon type="close-circle" />删除箱子</Button>
                    </Col>
                  </Row>
                  {/*这里用于存放箱内数据表头*/}
                  <Row className="boxTitleLine"
                  >
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
                    </Col>
                  </Row>
                  <div className="boxMain">
                    {/*第二层遍历, 取到单个箱内所有商品的数据*/}
                    {!boxItem.parcelProductVoList ? `` :
                      boxItem.parcelProductVoList.map((commoditiesItem,commoditiesKey) => {
                      return (
                        // 这里做取模运算, 隔行显示不同的底色
                        <Row className={`commoditiesInfo commoditiesInfo_${commoditiesKey+1}
                                        rowLineColor_${(commoditiesKey+1)%2 !== 0 ? 'light' : 'dark'}`}
                             key={`commoditiesInfo_${commoditiesKey+1}`}
                        >
                          <Col className="infoCol" span={3}>{commoditiesKey+1}</Col>
                          <Col className="infoCol" span={6}>{commoditiesItem.productCode}</Col>
                          <Col className="infoCol" span={10} title={commoditiesItem.productName}>{commoditiesItem.productName}</Col>
                          <Col className="infoCol" span={5}>
                            <Button shape="circle"
                                    // type="primary"
                                    icon="minus" style={{marginRight: 10}}
                                    onClick={this.changeProductNumber.bind(this,'minus',commoditiesItem.productCode)}
                            />
                            {commoditiesItem.productNum}
                            <Button shape="circle"
                                    // type="primary"
                                    icon="plus" style={{marginLeft: 10}}
                                    onClick={this.changeProductNumber.bind(this,'plus',commoditiesItem.productCode)}
                            />
                          </Col>
                        </Row>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="packInfo">

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

        {loadingShow &&
        // 遮罩层, 用于显示加载画面
        <div className="loadingShow">
          <p className="loadingTxt"><Icon type="loading" /> 更新并获取信息中, 请稍后...</p>
        </div>
        }
      </div>
    )
  }
}

export default commoditiesPackaging;