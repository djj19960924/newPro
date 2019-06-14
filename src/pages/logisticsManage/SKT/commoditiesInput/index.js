import React from "react";
import "./index.less";

class SKTCommoditiesInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 卸载 setState, 防止组件卸载时执行 setState 相关导致报错
  componentWillUnmount() {
    this.setState = () => null
  }
  render() {
    return (
      <div className="SKTCommoditiesInput">
        扫码录入商品
      </div>
    );
  }
}

export default SKTCommoditiesInput;