import React from 'react';
import { Icon, message, } from 'antd';
import allowedKeys from "@js/allowedKeys";

import './index.less';
class customerLogin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      elementQRCode: null,
      // 判断页面是否为激活状态, 当 window 失去焦点时, 页面进入待机遮罩状态
      isFocusOnWindow: true,
      // 加载显示
      loadingShow: false,
    };
    // window.customerLogin = this;
  }

  componentDidMount() {
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
        if ((new Date().getTime() - onKeyDownTime) <= 10) {
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
            inputValue = null;
          }
        }
      } else if (e.key === `Enter`) {
        // 由于扫码器最终一定会添加一个Enter以及一个下箭头按键作为结尾
        // 所以这里不处理下箭头, 直接以Enter作为输入结束符号,
        // 所有复位的功能都做在Enter中, 为保险起见, 也可作为公共结束事件,绑定在fetch内部的各个结果中
        let rule = new RegExp('^unionId:');
        if ((new Date().getTime() - onKeyDownTime) <= 10) {
          // console.log(inputValue);
          // console.log(inputValue.split('&'));
          if (rule.test(inputValue) && onKeyDownKey === e.key && (new Date().getTime() - lastInputTime) <= 50) {
            // 对 value 赋值, 并将各项数据复位
            let unionId = inputValue.split('&')[0].split(`unionId:`)[1];
            let nickname = decodeURIComponent(inputValue.split('&')[1].split(`nickname:`)[1]);
            clearData();
            if (unionId.length >= 28 && unionId.length <= 32) {
              // 如果长度也符合, 那么则可以模糊判定所获取到的信息为 unionId
              // 当符合条件的时候, 则可以进行接口操作, 根据 unionId 获取该用户下所有转运箱号资料
              message.success(`成功获取用户信息,即将跳转`);
              this.props.history.push(`/logistics-manage/BC-customsClearance/commodities-packaging/?unionId=${unionId}&nickname=${nickname}`)
            } else {
              message.error(`获取用户信息失败, 请重试`)
            }
          } else {
            message.error(`二维码格式错误, 请确保用户登陆二维码正确, 并重试`);
            clearData()
          }
        }
      }
    };
    window.onblur = () => {
      // console.log(`失去焦点!`);
      this.setState({isFocusOnWindow: true})
    };
    // window.onfocus = () => {
      // 由于失去焦点以后会生成全页面遮罩, 所以点击该遮罩即可确保获取焦点,
      // 而onfocus事件仅会在失去焦点的状态中生效, 故无需重复设置, 这里备注仅为出现特殊情况而作备选操作
      // console.log(`获得焦点!`);
    // };

    let isTest = false;
    if (window.isServerTest) isTest = true;
    if (window.isLocalTest) isTest = true;
    // 生成导向用户授权登陆的扫码页面
    let qrcode = new window.QRCode(this.refs.QRCodeShow, {
      text: `http://api.maishoumiji.com/wechat/authorize?returnUrl=http%3A%2F%2F${isTest ? 'test' : ''}m.maishoumiji.com/logisticsstatus`,
      width: 200,
      height: 200,
      colorDark : "#000",
      colorLight : "#fff",
      correctLevel : window.QRCode.CorrectLevel.H
    });
    this.setState({elementQRCode:qrcode})
  }

  componentWillUnmount() {
    // 组件关闭以后, 卸载window事件
    window.onkeyup = window.onkeydown = window.onblur = window.onfocus = null
  }

  render() {
    const { isFocusOnWindow, loadingShow, } = this.state;
    return (
      <div className="customerLogin">
        <h1 className="title">客户登陆</h1>
        <h2 className="subtitle">请用户展示登陆二维码</h2>

        <h2 className="info">可以用微信扫下方二维码, 进入授权登陆界面</h2>
        <div className="QRCodeShow"
             ref="QRCodeShow"
        />

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
            <p className="loadingTxt"><Icon type="loading" /> 获取用户信息中, 请稍后...</p>
          </div>
        }
      </div>
    )
  }
}

export default customerLogin;