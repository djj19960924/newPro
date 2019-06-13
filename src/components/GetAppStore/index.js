import React from 'react';
import { inject, observer } from 'mobx-react';
import GetProps from "./GetProps";

@inject('appStore') @observer
class GetAppStore extends React.Component {
  constructor(props) {
    super(props);
  }
  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => { return null }
  }
  // 这里进行说明:
  // 由于 @inject('appStore') @observer ,主要是由于 @observer(观察器) 的原因,
  // 会造成 props 的托管, 从而使 router 模块失效, 即 router 依赖于 props 更新机制而渲染页面的方式失效
  // 所以这里将 @observer 放置于 ContentMain 同层, 而非上层引用, 使得 ContentMain 内部的 props 为纯净的状态
  render() {
    return (
      <div className="GetAppStore">
        <GetProps allowSideList={[...this.props.appStore.allowSideList]}
                  userData={this.props.appStore.userData}
                  setInfo={this.props.setInfo}
        />
      </div>
    )
  }
}

export default GetAppStore;