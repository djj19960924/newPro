import React from 'react';
import CustomMenu from "../CustomMenu/index";
import menus from './menus';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import './index.less';

@withRouter @inject('appStore') @observer
class SiderNav extends React.Component {
  constructor(props) {
    super(props);
    this.getInfo();
  }
  // 渲染侧边栏同时更新用户信息, 并以此为依据渲染侧边栏和路由组件
  getInfo() {
    const { saveUserData, saveAllowSideList } = this.props.appStore;
    // 这里处理侧边栏数据源
    this.ajax.post('/user/getUserByName').then(r => {
      if (r.data.status === 10000) {
        saveUserData(r.data.data);
        saveAllowSideList(r.data.data.menuIdList);
      }
      r.showError();
    }).catch(r => {
      this.ajax.isReturnLogin(r,this);
    });
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  render() {
    return (
      <div id="SiderNav">
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

export default SiderNav