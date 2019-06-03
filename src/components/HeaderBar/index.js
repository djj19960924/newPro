import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import './index.less';

@withRouter @inject('appStore') @observer
class HeaderBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // 这里保存当前用户名
      userName: this.props.appStore.userData.userName,
      // message: 3,
    };
  }
  // clearMessage() {
  //   this.setState({
  //     message: 0,
  //   })
  // }
  loginOut() {
    const { history, location, } = this.props;
    const { clearAllData } = this.props.appStore;
    // 清除登录状态isLogin
    window.delCookie('isLogin');
    // 清除cookie中所保存的登录信息
    clearAllData();
    // 清除服务器错存储的cookie状态
    this.ajax.post('/login/logout').then(r => {
      // 静默登出, 只报成功, 通常接口调取失败则不考虑
      if (r.data.status === 10000) message.success(r.data.msg);
    }).catch(r => {
      console.error(r)
    });
    history.push(`/login?historyPath=${location.pathname}${encodeURIComponent(location.search)}`);
  }
  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  render() {
    return(
      <div className="HeaderBar">
        <div className="logo">BuyersHouse后台管理系统</div>
        <div className="userInfo">
          <ul>
            {/*简单判断剩余消息信息(试做功能)*/}
            {/*<li className={this.state.message ? 'message hasMessage' : 'message'}
                   onClick={this.clearMessage.bind(this)}>*/}
            {/*{this.state.message ? '有 ' : '暂无'}*/}
            {/*<span style={{color:'red'}}>{this.state.message ? this.state.message : ''}</span>*/}
            {/*{this.state.message ? ' 条' : ''}消息*/}
            {/*</li>*/}
            {/*这里动态显示用户名*/}
            <li>欢迎回来! {this.state.userName}</li>
            <li className="loginOut" onClick={this.loginOut.bind(this)}>退出登录</li>
          </ul>
        </div>
      </div>
    )}
}

export default HeaderBar;