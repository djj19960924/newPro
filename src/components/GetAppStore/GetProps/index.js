import React from 'react';

class GetProps extends React.Component {
  constructor(props) {
    super(props);
  }
  // 这里进行说明:
  // 由于 mobx-react 只能于 render 层实时渲染页面, 却不能在 componentWillUpdate 内部识别自身的 props 变化
  // 所以利用 render 层传参入此, 再利用 props 变化检测, 反向更新 Index, 再由 Index 传参进入 ContentMain
  // ContentMain 利用 props 变化检测, 进行实时更新 routes 的加载, 以确保更换用户/刷新页面等情况,
  // 都可以实时获取最新的 allowSideList, 以 allowSideList 渲染页面路由
  componentWillMount() {
    // console.warn([...this.props.allowSideList]);
    this.props.setInfo(this.props.allowSideList,this.props.userData.roleId);
  }
  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.props.userData.roleId !== nextProps.userData.roleId ||
      this.props.allowSideList.length !== nextProps.allowSideList.length) {
      // console.warn('渲染了路由');
      // console.log([...this.props.allowSideList]);
      // console.log([...nextProps.allowSideList]);
      this.props.setInfo(nextProps.allowSideList,nextProps.userData.roleId);
    }
  }
  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => null
  }
  render() {
    return (
      <div className="GetProps">
        {/*GetProps*/}
      </div>
    )
  }
}

export default GetProps;