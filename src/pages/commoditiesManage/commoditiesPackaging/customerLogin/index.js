import React from 'react';

import './index.less';
class customerLogin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      elementQRCode: null,
      // 检测键盘输入时间戳
      inputTime: null,
      // 保存符合时间戳条件的键值并将之拼接
      inputValue: ``,
      // 判断页面是否为激活状态, 当 window 失去焦点时, 页面进入待机遮罩状态
      isFocusOnWindow: false,
    };
    window.customerLogin = this;
  }

  componentDidMount() {
    window.onkeydown = (e) => {
      console.log(e);
      // console.log(new Date().getTime());
      // onkeydown 方法内部暂存当时这一步操作的时间戳,
      // 如果下一个键操作的时间戳与之前相比小于20ms(看情况定,如果电脑卡顿需要放开更多)
      // 则保存这个onkeydown的内容,将之拼接在字符串上
      // 并以最后一个enter作为结束符,然后对值进行判断,做区别操作

      const { inputTime, inputValue, } = this.state;
      // 这里直接给state内部对象赋值, 因为该值并不需要渲染, 只用作处理内部数据
      if (inputTime === null || ((new Date().getTime()) - inputTime) <= 20) {
        this.state.inputTime = new Date().getTime();
        this.state.inputValue += e.key;
        console.log(inputValue);
      } else {
        this.state.inputTime = null;
        this.state.inputValue = ``;
      }
    };
    window.onkeyup = (e) => {
      // console.log(e)
    };
    window.onblur = () => {
      console.log(`失去焦点!`)
    };
    window.onfocus = () => {
      console.log(`获得焦点!`)
    };
    let qrcode = new window.QRCode(this.refs.QRCodeShow, {
      text: "http://api.maishoumiji.com/wechat/authorize?returnUrl=http://m.maishoumiji.com",
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : window.QRCode.CorrectLevel.H
    });
    this.setState({elementQRCode:qrcode})
  }

  componentWillUnmount() {
    // 组件关闭以后, 卸载window事件
    window.onkeyup = window.onkeydown = window.onblur = window.onfocus = null
  }

  render() {
    return (
      <div className="customerLogin">
        客户登陆
        <div className="QRCodeShow"
             ref="QRCodeShow"
        />
      </div>
    )
  }
}

export default customerLogin;